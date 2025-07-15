import * as dotenv from "dotenv";
dotenv.config();

import {onCall, HttpsError, onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {GoogleGenerativeAI} from "@google/generative-ai";
import {initializeApp} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";
import {getAuth} from "firebase-admin/auth";
import {getMessaging} from "firebase-admin/messaging";
import {CloudTasksClient} from "@google-cloud/tasks";
import {Task, ScheduleBlock, UserPreference, Category} from "./types";

initializeApp();
const db = getFirestore();
const auth = getAuth();
const messaging = getMessaging();
const tasksClient = new CloudTasksClient();

// Configuration for Cloud Tasks
const project = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT;
const location = 'asia-east1'; // Or your preferred region
const queue = 'reminder-queue'; // Name of your Cloud Tasks queue
const queuePath = tasksClient.queuePath(project!, location, queue);

const GEMINI_API_KEY = process.env.GEMINI_KEY;

if (!GEMINI_API_KEY) {
  logger.error("GEMINI_KEY environment variable not set.");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({model: "gemini-1.5-flash-latest"});

/**
 * A test utility function to create a premium user for testing.
 */
export const createPremiumUser = onRequest(async (req, res) => {
  const testEmail = "premium@test.com";
  const testPassword = "password123";
  try {
    let userRecord = await auth.getUserByEmail(testEmail).catch(() => null);
    if (userRecord) {
      logger.info(`User ${testEmail} already exists.`);
    } else {
      userRecord = await auth.createUser({email: testEmail, password: testPassword, displayName: "Premium User"});
      logger.info(`Successfully created new user: ${userRecord.uid}`);
    }
    await db.collection("users").doc(userRecord.uid).set({email: testEmail, plan: "PREMIUM", displayName: "Premium User"});
    logger.info(`Set plan to PREMIUM for user: ${userRecord.uid}`);
    res.status(200).send(`Successfully created/updated premium user: ${testEmail} (UID: ${userRecord.uid}).`);
  } catch (error) {
    logger.error("Failed to create premium user", error);
    res.status(500).send("Error creating premium user.");
  }
});

/**
 * Receives tasks and preferences, returns a smart schedule suggestion.
 */
export const smartSchedule = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "The function must be called while authenticated.");
  }
  const uid = request.auth.uid;

  try {
    const userDoc = await db.collection("users").doc(uid).get();
    if (!userDoc.exists || userDoc.data()?.plan !== "PREMIUM") {
      throw new HttpsError("permission-denied", "This feature is only available for premium users.");
    }
  } catch (error) {
    logger.error("Failed to verify user plan", {uid, error});
    throw new HttpsError("internal", "Could not verify user plan.");
  }

  const {tasks: clientTasks, userPref: clientUserPref, existingBlocks: clientExistingBlocks} = request.data;
  logger.info(`Smart scheduling request for user: ${uid}`, {taskCount: clientTasks?.length || 0, clientUserPref});

  if (!clientTasks || !Array.isArray(clientTasks) || clientTasks.length === 0) {
    throw new HttpsError("invalid-argument", "The function must be called with a non-empty 'tasks' array.");
  }

  // Fetch actual data from Firestore to ensure data integrity and security
  const [tasksSnap, prefSnap, blocksSnap] = await Promise.all([
    db.collection('tasks').where('userId', '==', uid).where('done', '==', false).get(),
    db.collection('user_preferences').doc(uid).get(),
    db.collection('schedule_blocks').where('userId', '==', uid).where('start', '>=', new Date()).get(),
  ]);

  const tasks = tasksSnap.docs.map(doc => ({id: doc.id, ...doc.data()} as Task));
  const userPref = prefSnap.exists ? prefSnap.data() as UserPreference : {};
  const existingBlocks = blocksSnap.docs.map(doc => ({id: doc.id, ...doc.data()} as ScheduleBlock));

  const prompt = `
    As a scheduling expert, analyze the following tasks, user preferences,
    and existing schedule blocks. Generate an optimal schedule in JSON format.
    Tasks: ${JSON.stringify(tasks)}
    User Preferences: ${JSON.stringify(userPref)}
    Existing Blocks: ${JSON.stringify(existingBlocks)}
    Return a JSON array of schedule blocks, where each block has "taskId", "start" (ISO 8601), and "end" (ISO 8601).
    Ensure that the "taskId" in the generated schedule blocks matches one of the provided task IDs.
  `;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const scheduleSuggestion = JSON.parse(responseText);

    // Save the suggested schedule blocks to Firestore
    const batch = db.batch();
    for (const block of scheduleSuggestion) {
      // Ensure taskId exists and is valid
      if (!tasks.some(task => task.id === block.taskId)) {
        logger.warn(`Invalid taskId in suggested block: ${block.taskId}. Skipping.`);
        continue;
      }
      const newBlockRef = db.collection('schedule_blocks').doc();
      batch.set(newBlockRef, {
        userId: uid,
        taskId: block.taskId,
        start: new Date(block.start),
        end: new Date(block.end),
        auto: true, // Mark as auto-generated
        createdAt: new Date(),
      } as ScheduleBlock); // Cast to ScheduleBlock
      
    }
    await batch.commit();

    // Create Cloud Tasks for reminders
    for (const block of scheduleSuggestion) {
      // Ensure taskId exists and is valid
      if (!tasks.some(task => task.id === block.taskId)) {
        continue;
      }

      const task = tasks.find(t => t.id === block.taskId);
      if (!task) continue;

      const reminderTime = new Date(new Date(block.start).getTime() - 10 * 60 * 1000); // 10 minutes before start
      if (reminderTime.getTime() <= Date.now()) {
        logger.info(`Reminder time for task ${task.title} is in the past, skipping Cloud Task creation.`);
        continue;
      }

      // Fetch device token from user_preferences
      const userPrefDoc = await db.collection('user_preferences').doc(uid).get();
      const userPreference = userPrefDoc.exists ? userPrefDoc.data() as UserPreference : null;
      const deviceToken = userPreference?.deviceToken || null;

      if (!deviceToken) {
        logger.warn(`No device token found for user ${uid}. Skipping reminder task for task ${task.title}.`);
        continue;
      }

      const url = `https://${location}-${project}.cloudfunctions.net/reminderJob`; // URL to your reminderJob function
      const payload = {
        taskId: task.id,
        taskTitle: task.title,
        userId: uid,
        deviceToken: deviceToken,
      };

      const taskRequest = {
        parent: queuePath,
        task: {
          httpRequest: {
            httpMethod: 'POST' as const,
            url,
            body: Buffer.from(JSON.stringify(payload)).toString('base64'),
            headers: {
              'Content-Type': 'application/json',
            },
            // Add OIDC token for authentication if reminderJob is not public
            // oidcToken: {
            //   serviceAccountEmail: `${project}@appspot.gserviceaccount.com`,
            //   audience: url,
            // },
          },
          scheduleTime: {
            seconds: reminderTime.getTime() / 1000,
          },
        },
      };

      try {
        await tasksClient.createTask(taskRequest);
        logger.info(`Cloud Task created for task ${task.title} at ${reminderTime.toISOString()}`);
      } catch (taskError) {
        logger.error(`Error creating Cloud Task for task ${task.title}:`, taskError);
      }
    }

    return {schedule: scheduleSuggestion};
  } catch (error) {
    logger.error("Error calling Gemini API or saving schedule", {error: JSON.stringify(error)});
    throw new HttpsError("internal", "Failed to generate or save schedule from AI.", error);
  }
});

/**
 * Generates weekly analytics report and Eisenhower Matrix data.
 */
export const getWeeklyAnalytics = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "The function must be called while authenticated.");
  }
  const uid = request.auth.uid;

  const { startDate, endDate } = request.data; // Expect ISO 8601 strings

  if (!startDate || !endDate) {
    throw new HttpsError("invalid-argument", "startDate and endDate are required.");
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new HttpsError("invalid-argument", "Invalid date format for startDate or endDate.");
  }

  try {
    // Fetch tasks for the user
    const tasksSnap = await db.collection('tasks')
      .where('userId', '==', uid)
      .get();
    const tasks = tasksSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));

    // Fetch schedule blocks within the date range
    const scheduleBlocksSnap = await db.collection('schedule_blocks')
      .where('userId', '==', uid)
      .where('start', '>=', start)
      .where('start', '<=', end)
      .get();
    const scheduleBlocks = scheduleBlocksSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as ScheduleBlock));

    // Fetch categories for mapping
    const categoriesSnap = await db.collection('categories')
      .where('userId', '==', uid)
      .get();
    const categories = categoriesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
    const categoryMap = new Map(categories.map(cat => [cat.id, cat]));

    // --- Analytics Calculations ---
    let completedTasks = 0;
    let totalTasks = 0;
    const categoryCompletion: { [key: string]: { completed: number, total: number } } = {};
    const categoryTimeSpent: { [key: string]: number } = {}; // in minutes

    tasks.forEach(task => {
      totalTasks++;
      if (task.done) { // Assuming 'done' field exists for completed tasks
        completedTasks++;
      }

      if (task.categoryId) {
        if (!categoryCompletion[task.categoryId]) {
          categoryCompletion[task.categoryId] = { completed: 0, total: 0 };
        }
        categoryCompletion[task.categoryId].total++;
        if (task.done) {
          categoryCompletion[task.categoryId].completed++;
        }
      }
    });

    scheduleBlocks.forEach(block => {
      const task = tasks.find(t => t.id === block.taskId);
      if (task && task.categoryId) {
        const durationMinutes = (new Date(block.end).getTime() - new Date(block.start).getTime()) / (1000 * 60);
        categoryTimeSpent[task.categoryId] = (categoryTimeSpent[task.categoryId] || 0) + durationMinutes;
      }
    });

    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    // --- Eisenhower Matrix Logic ---
    const eisenhowerMatrix: {
      do: Task[];
      decide: Task[];
      delegate: Task[];
      delete: Task[];
    } = {
      do: [], // Important & Urgent
      decide: [], // Important & Not Urgent
      delegate: [], // Not Important & Urgent (less applicable for personal tasks, but can be used for quick, low-impact tasks)
      delete: [], // Not Important & Not Urgent
    };

    tasks.forEach(task => {
      // Assuming 'importance' (1-5, 5 being most important) and 'dueDate' fields exist
      const isImportant = task.importance >= 3; // Example threshold
      const isUrgent = task.dueDate && new Date(task.dueDate).getTime() <= Date.now() + (2 * 24 * 60 * 60 * 1000); // Due within 2 days

      if (isImportant && isUrgent) {
        eisenhowerMatrix.do.push(task);
      } else if (isImportant && !isUrgent) {
        eisenhowerMatrix.decide.push(task);
      } else if (!isImportant && isUrgent) {
        eisenhowerMatrix.delegate.push(task);
      } else {
        eisenhowerMatrix.delete.push(task);
      }
    });
    
    /**
     * Parses voice text into a task draft using AI.
     */
    
    /**
     * Parses voice text into a task draft using AI.
     */

    return {
      completionRate,
      categoryCompletion,
      categoryTimeSpent,
      eisenhowerMatrix,
      // You might want to return more detailed data like task history, stress heatmap data etc.
    };

  } catch (error) {
    logger.error("Error in getWeeklyAnalytics:", error);
    throw new HttpsError("internal", "Failed to generate weekly analytics.", error);
  }
});

/**
 * Sends a test push notification to a specific device token.
 */
export const sendTestNotification = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "The function must be called while authenticated.");
  }

  const {token} = request.data;
  if (!token) {
    throw new HttpsError("invalid-argument", "The function must be called with a 'token' argument.");
  }

  const payload = {
    notification: {
      title: "Hello from Firebase!",
      body: "This is a test notification from your backend function.",
    },
  };

  try {
    logger.info(`Sending notification to token: ${token}`);
    const response = await messaging.send({token, notification: payload.notification});
    logger.info("Successfully sent message:", response);
    return {success: true, messageId: response};
  } catch (error) {
    logger.error("Error sending message:", error);
    throw new HttpsError("internal", "Failed to send notification.", error);
  }
});

/**
 * Parses voice text into a task draft using AI.
 */
export const parseVoiceText = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "The function must be called while authenticated.");
  }
  const uid = request.auth.uid;

  const { voiceText } = request.data;

  if (!voiceText || typeof voiceText !== 'string' || voiceText.trim() === '') {
    throw new HttpsError("invalid-argument", "The function must be called with a non-empty 'voiceText' string.");
  }

  const prompt = `
    As a task management assistant, parse the following voice input into a JSON object representing a task draft.
    Extract the task title, estimated minutes (estMinutes), importance (1-5, 5 being most important), and an optional dueDate (ISO 8601 format).
    If a category is mentioned, try to identify it. If no specific value is found for a field, omit it from the JSON.
    Voice Input: "${voiceText}"
    Example Output:
    {
      "title": "Buy groceries",
      "estMinutes": 60,
      "importance": 4,
      "dueDate": "2025-07-20T18:00:00Z",
      "categoryName": "Shopping"
    }
    Return only the JSON object.
  `;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const taskDraft = JSON.parse(responseText);

    // Optional: Validate and refine the parsed taskDraft here
    // For example, ensure estMinutes is a number, importance is within range, etc.

    logger.info(`Parsed voice text for user ${uid}:`, taskDraft);
    return { taskDraft };
  } catch (error) {
    logger.error("Error parsing voice text with Gemini API", { error: JSON.stringify(error) });
    throw new HttpsError("internal", "Failed to parse voice text into task draft.", error);
  }
});

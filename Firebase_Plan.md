# Time Planner App - Backend Plan (Firebase Version)

This document outlines the backend architecture and development plan for the Time Planner application, based on the Firebase serverless platform.

---

## 0. 專案基本資訊 (Firebase 版本)

| 項目 | 選定技術 | 備註 |
| :--- | :--- | :--- |
| **語言 / 執行環境** | Node 18 + TypeScript 5 | 用於 Cloud Functions |
| **後端框架** | **Firebase Functions** | 取代 Express |
| **資料庫** | **Cloud Firestore (NoSQL)** | 取代 PostgreSQL |
| **ORM** | **Firebase Admin SDK** | 取代 Prisma |
| **認證** | **Firebase Authentication** | 取代手動實作 JWT |
| **AI 服務** | Gemini API (Flash / Pro) | 維持不變 |
| **推播** | **Firebase Cloud Messaging (FCM)** | 取代 Expo Push |
| **佇列 / 定時任務** | **Cloud Tasks / Cloud Scheduler** | 取代 BullMQ + Redis |

---

## 1. 專案目錄建議 (Firebase 版本)

The project structure is dictated by `firebase init`. Core logic resides within the `functions` directory.

```
/
 ├─ functions/
 │   ├─ src/
 │   │   ├─ services/      // Re-usable business logic (e.g., AI calls)
 │   │   │   └─ ai.service.ts
 │   │   ├─ jobs/          // Triggered functions (e.g., by Pub/Sub)
 │   │   │   └─ reminder.job.ts
 │   │   ├─ types/         // TypeScript type definitions
 │   │   │   └─ index.ts
 │   │   └─ index.ts       // Main entrypoint for all Cloud Functions
 │   ├─ package.json
 │   └─ tsconfig.json
 ├─ public/
 │   └─ test.html          // Our testing page
 ├─ firestore.rules        // Firestore security rules
 ├─ storage.rules          // Cloud Storage security rules
 └─ firebase.json          // Firebase project configuration
```

---

## 2. Firestore 資料模型

The data model is based on NoSQL principles, using root-level collections for major entities.

*   **/users/{userId}**
    *   `{ email, displayName, plan, createdAt }`
*   **/user_preferences/{userId}**
    *   `{ efficiencyPeak, defaultTransport, compactSchedule }`
*   **/categories/{categoryId}**
    *   `{ userId, name, colorHex }`
*   **/tasks/{taskId}**
    *   `{ userId, categoryId, title, importance, estMinutes, ... }`
*   **/schedule_blocks/{blockId}**
    *   `{ userId, taskId, start, end, auto }`
*   **/pomodoro_logs/{logId}**
    *   `{ userId, taskId, start, end }`

---

## 3. 後端功能一覽 (Firebase 版本)

Backend logic is implemented via direct client-to-database operations (governed by security rules) or by invoking specific Cloud Functions.

| 原始需求 | Firebase 實作方式 |
| :--- | :--- |
| **使用者註冊/登入** | Handled by **Firebase Auth SDK** on the client-side. |
| **任務/類別/排程的 CRUD** | Handled by **Firestore SDK** on the client-side, with permissions enforced by **Firestore Security Rules**. |
| **觸發智慧排程** | Invoke a **Callable Cloud Function** named `smartSchedule`. |
| **語音轉任務草稿** | Invoke a **Callable Cloud Function** named `parseVoiceText`. |
| **週分析報表** | Invoke a **Callable Cloud Function** named `getWeeklyAnalytics`. |

---

## 3.5 離線使用能力 (Offline Capabilities)

得益於 Firestore SDK 的設計，本應用程式將具備強大的離線使用能力。

*   **運作方式**: Firestore SDK 會在使用者手機上維護一份資料的本地快取。當離線時，所有讀取和寫入操作都會先針對此快取進行，讓 App 反應迅速。當網路恢復時，SDK 會在背景自動同步所有變更。

*   **功能可用性**:

| 功能 | 離線可用 | 線上可用 |
| :--- | :--- | :--- |
| **瀏覽/新增/修改/刪除任務、排程、分類** | ✅ | ✅ |
| **AI 智慧排程 / 語音輸入** | ❌ | ✅ |
| **首次登入/註冊** | ❌ | ✅ |

---

## 4. AI 服務封裝範例

The core logic for calling the Gemini API remains the same, but will be encapsulated within `functions/src/services/ai.service.ts` and imported by Cloud Functions.

---

## 5. 智慧排程流程 (Cloud Function 版本)

The logic resides within the `smartSchedule` callable function.

```typescript
// functions/src/index.ts (Simplified)
import { getFirestore } from "firebase-admin/firestore";
const db = getFirestore();

export const smartSchedule = onCall(async (request) => {
  const uid = request.auth.uid;
  // ... Premium plan verification ...

  const [tasksSnap, prefSnap, blocksSnap] = await Promise.all([
    db.collection('tasks').where('userId', '==', uid).where('done', '==', false).get(),
    db.collection('user_preferences').doc(uid).get(),
    db.collection('schedule_blocks').where('userId', '==', uid).where('start', '>=', new Date()).get()
  ]);

  const tasks = tasksSnap.docs.map(doc => doc.data());
  // ... The rest of the scheduling logic ...
});
```

---

## 6. 任務提醒 Job (Cloud Tasks 版本)

We will use Cloud Tasks instead of BullMQ.

*   **Flow**: When a schedule is created, the `smartSchedule` function can create a Cloud Task for each future event.
*   **Trigger**: The task is scheduled to trigger an internal HTTP endpoint or another Pub/Sub-triggered function 10 minutes before the event's start time.
*   **Execution**: The triggered function (`reminderJob`) will use the task's payload to send a push notification via **FCM**.

---

## 7. Firebase CLI 指令範例

```bash
# Initialize project (already done)
firebase init

# Install dependencies (in functions/ directory)
npm install @google/generative-ai firebase-admin firebase-functions

# Start the local emulator suite
firebase emulators:start

# Deploy functions to the cloud
firebase deploy --only functions
```

---

## 8. 前端 SDK

The frontend (React Native Expo) will use the official `firebase` package to interact with the backend. No custom SDK generation is needed.

```typescript
// Example in React Native
import { getFunctions, httpsCallable } from "firebase/functions";

const functions = getFunctions();
const smartSchedule = httpsCallable(functions, 'smartSchedule');

const onButtonPress = async () => {
  const result = await smartSchedule({ tasks: [...] });
  // Access result via result.data.schedule
}
```

---

## 9. 最小迭代路線圖 (Firebase 版本)

| Sprint | 後端交付 | 行動端驗證 |
| :--- | :--- | :--- |
| 1 | **Design Firestore Model**, write **Security Rules** for Task CRUD | TasksPage list, AddTaskDialog (direct Firestore ops) |
| 2 | Write **Security Rules** for ScheduleBlock CRUD | PlannerPage drag & drop (direct Firestore ops) |
| 3 | **`smartSchedule` Cloud Function** (Gemini integration) | Auto-schedule modal, Timeline display |
| 4 | **FCM Push** logic, **Cloud Tasks** integration | Receive test notifications, Pomodoro logging |
| 5 | **`getWeeklyAnalytics` Function**, Eisenhower Matrix logic | Sync Eisenhower Matrix, Stats page |
| 6 | **`parseVoiceText` Function** | VoicePopup to create tasks, Pomodoro task switching |
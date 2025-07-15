export interface User {
  email: string;
  displayName: string;
  plan: 'FREE' | 'PREMIUM';
  createdAt: Date;
}

export interface UserPreference {
  efficiencyPeak?: string;
  defaultTransport?: string;
  compactSchedule?: boolean;
  deviceToken?: string; // Added for FCM
}

export interface Category {
  id: string;
  userId: string;
  name: string;
  colorHex: string;
}

export interface Task {
  id: string;
  userId: string;
  categoryId?: string;
  title: string;
  importance: number; // e.g., 1-5
  estMinutes: number;
  done: boolean; // Added for completion tracking
  dueDate?: Date; // Added for Eisenhower Matrix
  createdAt: Date;
}

export interface ScheduleBlock {
  id: string;
  userId: string;
  taskId: string;
  start: Date;
  end: Date;
  auto: boolean;
  createdAt: Date;
}

export interface PomodoroLog {
  id: string;
  userId: string;
  taskId: string;
  start: Date;
  end: Date;
}
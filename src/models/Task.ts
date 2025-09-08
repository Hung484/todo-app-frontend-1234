export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum TaskPriority {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
}

export interface Task {
  _id: string;
  listId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: string;
  priority: TaskPriority;
  createdAt: string;
  updatedAt: string;
  reminder?: Reminder;
}

export enum ReminderType {
  PUSH = 'push',
  EMAIL = 'email',
}

export interface Reminder {
  _id: string;
  taskId: string;
  reminderTime: string;
  type: ReminderType;
  createdAt: string;
}
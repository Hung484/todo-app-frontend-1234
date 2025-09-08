import api from './api';
import { Task, TaskStatus, TaskPriority, ReminderType } from '../models/Task';

const TASKS_URL = '/tasks';

export const getTasks = async (listId: string): Promise<Task[]> => {
  const response = await api.get<Task[]>(`${TASKS_URL}/list/${listId}`);
  return response.data;
};

export const getTaskById = async (id: string): Promise<Task> => {
  const response = await api.get<Task>(`${TASKS_URL}/${id}`);
  return response.data;
};

export interface CreateTaskRequest {
  listId: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority?: TaskPriority;
  reminderTime?: string;
  reminderType?: ReminderType;
}

export const createTask = async (data: CreateTaskRequest): Promise<Task> => {
  const response = await api.post<Task>(TASKS_URL, data);
  return response.data;
};

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  dueDate?: string | null;
  priority?: TaskPriority;
  reminderTime?: string | null;
  reminderType?: ReminderType;
}

export const updateTask = async (id: string, data: UpdateTaskRequest): Promise<Task> => {
  const response = await api.put<Task>(`${TASKS_URL}/${id}`, data);
  return response.data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await api.delete(`${TASKS_URL}/${id}`);
};
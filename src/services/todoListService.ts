import api from './api';
import { TodoList } from '../models/TodoList';

const LISTS_URL = '/lists';

export const getLists = async (): Promise<TodoList[]> => {
  const response = await api.get<TodoList[]>(LISTS_URL);
  return response.data;
};

export const getListById = async (id: string): Promise<TodoList> => {
  const response = await api.get<TodoList>(`${LISTS_URL}/${id}`);
  return response.data;
};

export const createList = async (title: string): Promise<TodoList> => {
  const response = await api.post<TodoList>(LISTS_URL, { title });
  return response.data;
};

export const updateList = async (id: string, title: string): Promise<TodoList> => {
  const response = await api.put<TodoList>(`${LISTS_URL}/${id}`, { title });
  return response.data;
};

export const deleteList = async (id: string): Promise<void> => {
  await api.delete(`${LISTS_URL}/${id}`);
};
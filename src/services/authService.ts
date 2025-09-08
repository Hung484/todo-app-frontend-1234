import api from './api';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../models/User';

const AUTH_URL = '/auth';

export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(`${AUTH_URL}/register`, data);
  return response.data;
};

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(`${AUTH_URL}/login`, data);
  return response.data;
};

export const getProfile = async (): Promise<User> => {
  const response = await api.get<User>(`${AUTH_URL}/profile`);
  return response.data;
};

export const saveUserData = (token: string, user: User): void => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

export const getUserData = (): User | null => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
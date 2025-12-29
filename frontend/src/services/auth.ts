import api from './api';
import { ApiResponse, AuthResponse, User } from '@/types';

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', {
      email,
      password,
    });
    return response.data.data;
  },

  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    departmentId: string;
    designation: string;
  }): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return response.data.data;
  },

  async getProfile(): Promise<User> {
    const response = await api.get<ApiResponse<User>>('/auth/profile');
    return response.data.data;
  },

  async updateProfile(data: any): Promise<any> {
    const response = await api.put<ApiResponse<any>>('/auth/profile', data);
    return response.data.data;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.put('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  },
};

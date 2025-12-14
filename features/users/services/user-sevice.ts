import apiClient from '@/lib/api-client';
import { User } from '../types/user-types';

export const userService = {
    getUsers: async (): Promise<User[]> => {
        const response = await apiClient.get('/users');
        return response.data;
    },

    getUserById: async (id: number): Promise<User> => {
        const response = await apiClient.get(`/users/${id}`);
        return response.data;
    },

    createUser: async (user: User): Promise<User> => {
        const response = await apiClient.post('/users', { user });
        return response.data;
    },

    updateUser: async (id: number, user: User): Promise<User> => {
        const response = await apiClient.put(`/users/${id}`, { user });
        return response.data;
    },

    deleteCategory: async (id: number): Promise<void> => {
        await apiClient.delete(`/categories/${id}`);
    },
};
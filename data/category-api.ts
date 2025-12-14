import apiClient from '@/lib/api-client';
import { Category, CategoryFormData } from '@/features/categories/types/category-types';

export const categoryApi = {
    getCategories: async (): Promise<Category[]> => {
        const response = await apiClient.get('/categories');
        return response.data;
    },

    getCategoryById: async (id: number): Promise<Category> => {
        const response = await apiClient.get(`/categories/${id}`);
        return response.data;
    },

    createCategory: async (name: string): Promise<Category> => {
        const response = await apiClient.post('/categories', { name });
        return response.data;
    },

    updateCategory: async (id: number, name: string): Promise<Category> => {
        const response = await apiClient.put(`/categories/${id}`, { name });
        return response.data;
    },

    deleteCategory: async (id: number): Promise<void> => {
        await apiClient.delete(`/categories/${id}`);
    },
};
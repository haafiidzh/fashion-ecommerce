import apiClient from '@/lib/api-client';
import { Role } from '../types/role-types';

export const rolesApi = {
    getRoles: async (): Promise<Role[]> => {
        const response = await apiClient.get('/roles');
        return response.data;
    },

    getRoleById: async (id: number): Promise<Role> => {
        const response = await apiClient.get(`/roles/${id}`);
        return response.data;
    },

    createRole: async (role: Role): Promise<Role> => {
        const response = await apiClient.post('/roles', { role });
        return response.data;
    },

    updateRole: async (id: number, role: Role): Promise<Role> => {
        const response = await apiClient.put(`/roles/${id}`, { role });
        return response.data;
    },

    deleteRole: async (id: number): Promise<void> => {
        await apiClient.delete(`/roles/${id}`);
    },
};
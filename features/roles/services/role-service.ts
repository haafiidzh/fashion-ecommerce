import apiClient from "@/lib/api-client";
import { Role } from "../types/role-types";

export const rolesData = async (): Promise<Role[]> => {
  const response = await apiClient.get("/roles");
  return response.data?.data || [];
};

export const rolesApi = {
  getRoles: async (): Promise<Role[]> => {
    const roles = await rolesData();
    return roles;
  },

  findRoleById: async (id: number): Promise<Role> => {
    const roles = await rolesData();
    const role = roles.find((role) => role.id === id);
    if (!role) {
      throw new Error("Role not found");
    }
    return role;
  },

  createRole: async (role: Role & { permissions?: number[] }): Promise<Role> => {
    const response = await apiClient.post("/roles", {
      name: role.name,
      guard: role.guard,
      permissions: role.permissions || [],
    });
    const res = response.data;
    if (!res || !res.success || !res.data) {
      throw new Error(res?.message || "Error creating role");
    }
    return res.data;
  },

  updateRole: async (id: number, role: Role & { permissions?: number[] }): Promise<Role> => {
    const response = await apiClient.put(`/roles/${id}`, {
      name: role.name,
      guard: role.guard,
      permissions: role.permissions || [],
    });
    const res = response.data;
    if (!res || !res.success || !res.data) {
      throw new Error(res?.message || "Error updating role");
    }
    return res.data;
  },

  deleteRole: async (id: number): Promise<void> => {
    const response = await apiClient.delete(`/roles/${id}`);
    const res = response.data;
    if (!res || !res.success || !res.data) {
      throw new Error(res?.message || "Error deleting role");
    }
    return res.data;
  },

  assignRoleToUser: async (userId: number, roleId: number): Promise<void> => {
    const response = await apiClient.post(`/users/assign-role`, {
      user_id: userId,
      role_id: roleId,
    });
    const res = response.data;
    if (!res || !res.success || !res.data) {
      throw new Error(res?.message || "Error assigning role to user");
    }
  },
};

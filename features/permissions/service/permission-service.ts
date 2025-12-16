import apiClient from "@/lib/api-client";
import { Permission } from "../types/permission-types";

export const permissionsData = async (): Promise<Permission[]> => {
  const response = await apiClient.get("/permissions");
  return response.data?.data || [];
};

export const permissionApi = {
	getPermissions: async (): Promise<Permission[]> => {
		const permissions = await permissionsData();
		return permissions;
	},

	findPermissionById: async (id: number): Promise<Permission> => {
		const permissions = await permissionsData();
		const permission = permissions.find((permission) => permission.id === id);
		if (!permission) {
			throw new Error("Permission not found");
		}
		return permission;
	},

	createPermission: async (permission: Permission): Promise<Permission> => {
		const response = await apiClient.post("/permissions", {
      name: permission.name,
      guard: permission.guard,
    });
		const res = response.data;
		if (!res || !res.success || !res.data) {
			throw new Error(res?.message || "Error creating permission");
		}
		return res.data;
	},

	updatePermission: async (id: number, permission: Permission): Promise<Permission> => {
		const response = await apiClient.put(`/permissions/${id}`, {
      name: permission.name,
      guard: permission.guard,
    });
		const res = response.data;
		if (!res || !res.success || !res.data) {
			throw new Error(res?.message || "Error updating permission");
		}
		return res.data;
	},

	deletePermission: async (id: number): Promise<void> => {
		const response = await apiClient.delete(`/permissions/${id}`);
		const res = response.data;
		if (!res || !res.success || !res.data) {
			throw new Error(res?.message || "Error deleting permission");
		}
		return res.data;
	},
};

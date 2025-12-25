import apiClient from "@/lib/api-client";
import { User } from "../types/user-types";

export const usersData = async (): Promise<User[]> => {
  const response = await apiClient.get("/users");
  console.log("response", response.data.data);
  return response.data?.data || [];
};

export const usersApi = {
  getUsers: async (includeDeleted = false): Promise<User[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const users = await usersData();
    return includeDeleted ? users : users.filter((u: User) => !u.deleted_at);
  },

  findUserById: async (
    userId: number,
    includeDelete: boolean = false
  ): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const users = await usersData();
    const user = users.find(
      (user) =>
        user.id === userId && (includeDelete || user.deleted_at === null)
    );

    if (!user) {
      throw new Error(`User not found`);
    }
    return user;
  },

  createUser: async (user: User): Promise<User> => {
    const response = await apiClient.post("/users", {
      username: user.username,
      email: user.email,
      password: user.password,
      phone: user.phone,
      pob: user.pob,
      dob: user.dob,
      gender: user.gender,
    });

    const res = response.data;
    if (!res || !res.success || !res.data) {
      throw new Error(res?.message || "Error creating user");
    }

    return res.data;
  },
  
  updateUser: async (userId: number, userData: User): Promise<User> => {
    // update User
    const response = await apiClient.put(`/users/${userId}`, {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      phone: userData.phone,
      pob: userData.pob,
      dob: userData.dob,
      gender: userData.gender,
    });

    const res = response.data;
    if (!res || !res.success || !res.data) {
      throw new Error(res?.message || "Error updating user");
    }

    return res.data;
  },

  deleteUser: async (userId: number): Promise<void> => {
    const response = await apiClient.delete(`/users/${userId}`);

    const res = response.data;
    if (!res || !res.success) {
      throw new Error(res?.message || "Error deleting user");
    }
  },
};
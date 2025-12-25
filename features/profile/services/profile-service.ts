import { Profile, UpdateProfileData } from "../types/profile-types";

export const profileApi = {
  getProfile: async (userId: string): Promise<Profile> => {
    const response = await fetch(`/api/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch profile");
    }

    return response.json();
  },

  updateProfile: async (
    userId: string,
    data: UpdateProfileData
  ): Promise<Profile> => {
    const response = await fetch(`/api/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update profile");
    }

    return response.json();
  },
};

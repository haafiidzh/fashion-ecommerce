"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { IconUser } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Profile, UpdateProfileData } from "@/features/profile/types/profile-types";
import ProfileForm from "@/features/profile/components/profile-form";
import ProfileSidebar from "@/features/profile/components/profile-sidebar";

const ProfileSkeleton = () => {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="space-y-2">
        <div className="h-8 w-48 animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-700" />
        <div className="h-4 w-64 animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-700" />
      </div>

      <div className="grid w-full gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-neutral-200 bg-white p-8 dark:border-neutral-700 dark:bg-neutral-800">
            <div className="mb-6 h-6 w-48 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
            <div className="space-y-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-24 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
                  <div className="h-10 w-full animate-pulse rounded-lg bg-neutral-100 dark:bg-neutral-700" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
            <div className="mb-4 h-5 w-32 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-16 animate-pulse rounded-lg bg-neutral-100 dark:bg-neutral-700"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchProfile();
    } else if (session && !session.user?.id) {
      // Fallback jika tidak ada ID
      setProfile({
        id: 0,
        username: session.user?.name || "User",
        email: session.user?.email || "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      setLoading(false);
    }
  }, [session]);

  const fetchProfile = async () => {
    if (!session?.user?.id) return;

    try {
      const response = await fetch(`/api/users/${session.user.id}`);
      
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      } else {
        // Fallback ke data session jika API gagal
        setProfile({
          id: parseInt(session.user.id),
          username: session.user?.name || "User",
          email: session.user?.email || "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      // Fallback ke data session jika error
      setProfile({
        id: parseInt(session.user.id || "0"),
        username: session.user?.name || "User",
        email: session.user?.email || "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: UpdateProfileData) => {
    if (!session?.user?.id) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/users/${session.user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        setIsEditing(false);
        toast.success("Profile updated successfully");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (status === "loading" || loading) {
    return <ProfileSkeleton />;
  }

  if (!session || !profile) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            General Details
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Update your personal details here.
          </p>
        </div>
        <div className="flex gap-3">
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          )}
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid w-full gap-6 lg:grid-cols-3">
        {/* Personal Information Form */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-neutral-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-900 dark:bg-neutral-100">
                <IconUser className="h-5 w-5 text-white dark:text-neutral-900" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  Personal Information
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Your account details
                </p>
              </div>
            </div>

            <ProfileForm
              profile={profile}
              isEditing={isEditing}
              onSubmit={handleSave}
              onCancel={handleCancel}
              saving={saving}
            />
          </div>
        </div>

        {/* Sidebar - Admin Info */}
        <ProfileSidebar profile={profile} />
      </div>
    </div>
  );
}

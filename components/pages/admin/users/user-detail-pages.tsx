"use client";

import { User } from "@/features/users/types/user-types";
import { useRouter } from "next/navigation";
import {
  IconArrowLeft,
  IconUser,
  IconMail,
  IconPhone,
  IconCalendar,
  IconMapPin,
  IconGenderBigender,
  IconClock,
  IconEdit,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

export default function UserDetailPages({ data }: { data: any }) {
  const router = useRouter();
  const user: User = (data?.data || data) as User;

  if (!user) {
    return (
      <div className="flex flex-col gap-4 p-4 md:p-10">
        <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
          <p className="text-neutral-600 dark:text-neutral-400">User not found</p>
        </div>
      </div>
    );
  }

  const formatDate = (date: Date | string | null | undefined): string => {
    if (!date) return "N/A";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return "N/A";
    return new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(dateObj);
  };

  const formatDateTime = (date: Date | string | null | undefined): string => {
    if (!date) return "N/A";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return "N/A";
    return new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(dateObj);
  };

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex flex-col gap-4 p-4 md:p-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="cursor-pointer"
          >
            <IconArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
              User Detail
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              View and manage user information
            </p>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-purple-600 text-2xl font-bold text-white shadow-lg">
            {getInitials(user.username || "U")}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
              {user.username}
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              {user.email}
            </p>
            {user.deleted_at && (
              <span className="inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                Deleted
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Information Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Personal Information */}
        <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
          <h3 className="mb-4 text-lg font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
            <IconUser className="h-5 w-5" />
            Personal Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                Username
              </label>
              <p className="mt-1 text-neutral-800 dark:text-neutral-200">
                {user.username || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
                <IconMail className="h-4 w-4" />
                Email
              </label>
              <p className="mt-1 text-neutral-800 dark:text-neutral-200">
                {user.email || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
                <IconPhone className="h-4 w-4" />
                Phone
              </label>
              <p className="mt-1 text-neutral-800 dark:text-neutral-200">
                {user.phone || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
                <IconGenderBigender className="h-4 w-4" />
                Gender
              </label>
              <p className="mt-1 text-neutral-800 dark:text-neutral-200 capitalize">
                {user.gender || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
          <h3 className="mb-4 text-lg font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
            <IconCalendar className="h-5 w-5" />
            Additional Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
                <IconCalendar className="h-4 w-4" />
                Date of Birth
              </label>
              <p className="mt-1 text-neutral-800 dark:text-neutral-200">
                {formatDate(user.dob)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
                <IconMapPin className="h-4 w-4" />
                Place of Birth
              </label>
              <p className="mt-1 text-neutral-800 dark:text-neutral-200">
                {user.pob || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
        <h3 className="mb-4 text-lg font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
          <IconClock className="h-5 w-5" />
          Account Information
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              User ID
            </label>
            <p className="mt-1 text-neutral-800 dark:text-neutral-200">
              #{user.id}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              Created At
            </label>
            <p className="mt-1 text-neutral-800 dark:text-neutral-200">
              {formatDateTime(user.created_at)}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              Last Updated
            </label>
            <p className="mt-1 text-neutral-800 dark:text-neutral-200">
              {formatDateTime(user.updated_at)}
            </p>
          </div>
          {user.deleted_at && (
            <div>
              <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                Deleted At
              </label>
              <p className="mt-1 text-neutral-800 dark:text-neutral-200">
                {formatDateTime(user.deleted_at)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

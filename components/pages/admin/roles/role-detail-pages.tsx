"use client";

import { Button } from "@/components/ui/button";
import {
  IconArrowLeft,
  IconCalendar,
  IconClock,
  IconId,
  IconUser,
} from "@tabler/icons-react";
import Link from "next/link";
import { Role } from "@/features/roles/types/role-types";

export default function RoleDetailPages({ data }: { data: Role }) {
  const { id, name, guard, created_at, updated_at } = data;

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

  if (!data) {
    return (
      <div className="flex flex-col gap-4 p-4 md:p-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="cursor-pointer"
            >
              <Link href="/dashboard/roles">
                <IconArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
                Role Detail
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                View and manage role information
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
          <p className="text-neutral-600 dark:text-neutral-400">
            Role not found
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="cursor-pointer"
          >
            <Link href="/dashboard/roles">
              <IconArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
              Role Detail
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              View and manage role information
            </p>
          </div>
        </div>
      </div>

      {/* Summary Card */}
      <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-2xl font-bold text-white shadow-lg">
            <IconUser className="h-8 w-8" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
              {name}
            </h2>
            <p className="mt-1 inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/40 dark:text-blue-200">
              <IconUser className="h-4 w-4" />
              {guard}
            </p>
          </div>
        </div>
      </div>

      {/* Information Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Role Information */}
        <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
          <h3 className="mb-4 text-lg font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
            <IconUser className="h-5 w-5" />
            Role Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                Name
              </label>
              <p className="mt-1 text-neutral-800 dark:text-neutral-200">
                {name}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                Guard
              </label>
              <p className="mt-1 text-neutral-800 dark:text-neutral-200">
                {guard}
              </p>
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
          <h3 className="mb-4 text-lg font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
            <IconCalendar className="h-5 w-5" />
            Metadata
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
                <IconId className="h-4 w-4" />
                Role ID
              </label>
              <p className="mt-1 text-neutral-800 dark:text-neutral-200">
                #{id}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
                <IconCalendar className="h-4 w-4" />
                Created At
              </label>
              <p className="mt-1 text-neutral-800 dark:text-neutral-200">
                {formatDateTime(created_at)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
                <IconClock className="h-4 w-4" />
                Last Updated
              </label>
              <p className="mt-1 text-neutral-800 dark:text-neutral-200">
                {formatDateTime(updated_at)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

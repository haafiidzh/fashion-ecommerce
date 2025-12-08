"use client";

import { useSession } from "next-auth/react";

export default function SettingsPage() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col gap-4 p-4 md:p-10">
      <div>
        <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
          Settings
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Manage your account settings
        </p>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
        <h2 className="mb-4 text-lg font-semibold text-neutral-800 dark:text-neutral-200">
          Profile Information
        </h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-neutral-600 dark:text-neutral-400">
              Name
            </label>
            <p className="mt-1 text-neutral-800 dark:text-neutral-200">
              {session?.user?.name}
            </p>
          </div>
          <div>
            <label className="text-sm text-neutral-600 dark:text-neutral-400">
              Email
            </label>
            <p className="mt-1 text-neutral-800 dark:text-neutral-200">
              {session?.user?.email}
            </p>
          </div>
          <div>
            <label className="text-sm text-neutral-600 dark:text-neutral-400">
              User ID
            </label>
            <p className="mt-1 text-neutral-800 dark:text-neutral-200">
              {session?.user?.id}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

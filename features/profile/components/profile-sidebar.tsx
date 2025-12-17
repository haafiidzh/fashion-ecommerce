"use client";

import { Profile } from "../types/profile-types";

interface ProfileSidebarProps {
  profile: Profile;
}

export default function ProfileSidebar({ profile }: ProfileSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Roles Card */}
      {profile.roles && profile.roles.length > 0 && (
        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
          <h3 className="mb-4 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            Admin Roles
          </h3>
          <div className="space-y-2">
            {profile.roles.map((role, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-700 dark:bg-neutral-900/50"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 dark:bg-neutral-100">
                  <svg
                    className="h-4 w-4 text-white dark:text-neutral-900"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {role.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Account Info Card */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
        <h3 className="mb-4 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          Account Information
        </h3>
        <div className="space-y-4">
          <div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Member Since
            </p>
            <p className="mt-1 text-sm font-medium text-neutral-900 dark:text-neutral-100">
              {new Date(profile.created_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="h-px bg-neutral-200 dark:bg-neutral-700" />
          <div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Last Updated
            </p>
            <p className="mt-1 text-sm font-medium text-neutral-900 dark:text-neutral-100">
              {new Date(profile.updated_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          {profile.email_verified_at && (
            <>
              <div className="h-px bg-neutral-200 dark:bg-neutral-700" />
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Email Verified
                </p>
                <p className="mt-1 text-sm font-medium text-green-600 dark:text-green-400">
                  {new Date(profile.email_verified_at).toLocaleDateString(
                    "id-ID",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

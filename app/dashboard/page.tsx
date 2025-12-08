"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex h-full items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-10">
      <div>
        <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
          Dashboard
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Selamat datang, {session.user.name}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Total Users", value: "1,234" },
          { label: "Total Products", value: "567" },
          { label: "Total Orders", value: "890" },
          { label: "Revenue", value: "$12,345" },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800"
          >
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {stat.label}
            </p>
            <p className="mt-2 text-2xl font-bold text-neutral-800 dark:text-neutral-200">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Content Area */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
          <h2 className="mb-4 text-lg font-semibold text-neutral-800 dark:text-neutral-200">
            Recent Activity
          </h2>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 animate-pulse rounded bg-neutral-100 dark:bg-neutral-700"
              />
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
          <h2 className="mb-4 text-lg font-semibold text-neutral-800 dark:text-neutral-200">
            Quick Stats
          </h2>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 animate-pulse rounded bg-neutral-100 dark:bg-neutral-700"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useSession, signOut } from "next-auth/react";
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
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
            >
              Logout
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-gray-600">Selamat datang,</p>
              <p className="text-xl font-semibold">{session.user.name}</p>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-gray-600">Email:</p>
              <p className="font-medium">{session.user.email}</p>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-gray-600">User ID:</p>
              <p className="font-medium">{session.user.id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

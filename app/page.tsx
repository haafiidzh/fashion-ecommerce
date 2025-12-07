"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-8 p-8">
        <h1 className="text-5xl font-bold text-gray-800">
          Fashion E-Commerce
        </h1>
        
        <p className="text-xl text-gray-600">
          Selamat datang di aplikasi fashion kami
        </p>

        {status === "loading" ? (
          <p className="text-gray-500">Loading...</p>
        ) : session ? (
          <div className="space-y-4">
            <p className="text-lg text-gray-700">
              Halo, <span className="font-semibold">{session.user.name}</span>!
            </p>
            <Link
              href="/dashboard"
              className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
            >
              Ke Dashboard
            </Link>
          </div>
        ) : (
          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-8 py-3 bg-white hover:bg-gray-50 text-blue-600 font-medium rounded-lg border-2 border-blue-600 transition"
            >
              Daftar
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

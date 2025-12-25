"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CustomerLayout } from "@/components/layout";
import { User, Mail, ShoppingBag, MapPin, Lock } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <CustomerLayout breadcrumbs={[{ label: "Profile" }]}>
        <div className="max-w-[1240px] mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  if (!session) {
    return null;
  }

  const menuItems = [
    {
      icon: User,
      label: "Personal Information",
      description: "Update your personal details",
      href: "/profile/edit",
    },
    {
      icon: ShoppingBag,
      label: "My Orders",
      description: "Track and manage your orders",
      href: "/profile/orders",
    },
    {
      icon: MapPin,
      label: "Addresses",
      description: "Manage shipping addresses",
      href: "/profile/addresses",
    },
    {
      icon: Lock,
      label: "Change Password",
      description: "Update your account password",
      href: "/profile/change-password",
    },
  ];

  return (
    <CustomerLayout breadcrumbs={[{ label: "My Account" }]}>
      <div className="max-w-[1240px] mx-auto px-4 py-8 sm:py-12">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl border border-black/10 p-6 sm:p-8 mb-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-black text-white flex items-center justify-center text-3xl font-bold">
              {session.user.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-black mb-1">
                {session.user.name}
              </h1>
              <p className="text-black/60 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {session.user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-black/10 p-5 text-center">
            <div className="text-2xl font-bold text-black mb-1">2</div>
            <div className="text-sm text-black/60">Orders</div>
          </div>
          <div className="bg-white rounded-xl border border-black/10 p-5 text-center">
            <div className="text-2xl font-bold text-black mb-1">1</div>
            <div className="text-sm text-black/60">Addresses</div>
          </div>
          <div className="bg-white rounded-xl border border-black/10 p-5 text-center">
            <div className="text-2xl font-bold text-black mb-1">Active</div>
            <div className="text-sm text-black/60">Account Status</div>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={index}
                href={item.href}
                className="bg-white rounded-xl border border-black/10 p-6 hover:border-black/30 hover:shadow-md transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-black mb-1">
                      {item.label}
                    </h3>
                    <p className="text-sm text-black/60">{item.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Logout Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push("/api/auth/signout")}
            className="inline-flex items-center justify-center px-8 py-3 text-sm font-medium text-black border-2 border-black rounded-full hover:bg-black hover:text-white transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </CustomerLayout>
  );
}

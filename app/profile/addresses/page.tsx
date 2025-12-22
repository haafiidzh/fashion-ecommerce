"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CustomerLayout } from "@/components/layout";
import { MapPin, Plus } from "lucide-react";

export default function AddressesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <CustomerLayout breadcrumbs={[{ label: "Profile", href: "/profile" }, { label: "Addresses" }]}>
        <div className="max-w-[1240px] mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout breadcrumbs={[{ label: "Profile", href: "/profile" }, { label: "Addresses" }]}>
      <div className="max-w-[1240px] mx-auto px-4 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-black">My Addresses</h1>
          <button className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-black rounded-full hover:bg-black/90 transition-colors">
            <Plus className="h-4 w-4" />
            Add Address
          </button>
        </div>

        {/* Empty State */}
        <div className="bg-white rounded-2xl border border-black/10 p-12 text-center">
          <MapPin className="h-16 w-16 text-black/20 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-black mb-2">No addresses saved</h3>
          <p className="text-black/60 mb-6">Add a shipping address for faster checkout</p>
        </div>
      </div>
    </CustomerLayout>
  );
}

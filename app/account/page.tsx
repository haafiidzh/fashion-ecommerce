"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  AccountSection,
  UserAccount,
  Address,
  Order,
  UpdatePasswordData,
} from "@/features/user-account/types/account-types";
import AccountSidebar from "@/features/user-account/components/account-sidebar";
import BasicInfoSection from "@/features/user-account/components/basic-info-section";
import AddressSection from "@/features/user-account/components/address-section";
import PasswordSection from "@/features/user-account/components/password-section";
import OrdersSection from "@/features/user-account/components/orders-section";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<AccountSection>("orders");
  const [user, setUser] = useState<UserAccount | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchUserData();
    }
  }, [session]);

  const fetchUserData = async () => {
    if (!session?.user?.id) return;

    try {
      // Fetch user info
      const userRes = await fetch(`/api/users/${session.user.id}`);
      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData);
      }

      // Fetch addresses
      const addressRes = await fetch(`/api/addresses?userId=${session.user.id}`);
      if (addressRes.ok) {
        const addressData = await addressRes.json();
        setAddresses(addressData);
      }

      // Fetch orders
      console.log('Fetching orders for user ID:', session.user.id);
      const ordersRes = await fetch(`/api/orders?userId=${session.user.id}`);
      console.log('Orders response status:', ordersRes.status);
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        console.log('Orders data:', ordersData);
        setOrders(ordersData.data || []); // Extract data array from API response
      } else {
        console.error('Failed to fetch orders:', ordersRes.status, ordersRes.statusText);
        setOrders([]); // Set empty array on error
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateInfo = async (data: Partial<UserAccount>) => {
    if (!session?.user?.id) return;

    try {
      const response = await fetch(`/api/users/${session.user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const updated = await response.json();
        setUser(updated);
        toast.success("Information updated successfully");
      } else {
        toast.error("Failed to update information");
      }
    } catch (error) {
      console.error("Error updating info:", error);
      toast.error("Failed to update information");
    }
  };

  const handleAddAddress = async (data: Partial<Address>) => {
    if (!session?.user?.id) return;

    try {
      const response = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, user_id: session.user.id }),
      });

      if (response.ok) {
        const newAddress = await response.json();
        setAddresses([...addresses, newAddress]);
        toast.success("Address added successfully");
      } else {
        toast.error("Failed to add address");
      }
    } catch (error) {
      console.error("Error adding address:", error);
      toast.error("Failed to add address");
    }
  };

  const handleUpdateAddress = async (id: number, data: Partial<Address>) => {
    try {
      const response = await fetch(`/api/addresses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const updated = await response.json();
        setAddresses(addresses.map((a) => (a.id === id ? updated : a)));
        toast.success("Address updated successfully");
      } else {
        toast.error("Failed to update address");
      }
    } catch (error) {
      console.error("Error updating address:", error);
      toast.error("Failed to update address");
    }
  };

  const handleUpdatePassword = async (data: UpdatePasswordData) => {
    if (!session?.user?.id) return;

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success("Password updated successfully");
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to update password");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-neutral-200 border-t-black"></div>
          <p className="mt-4 text-sm text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Data dummy jika tidak ada session
  const dummyUser: UserAccount = {
    id: 1,
    username: "John Doe",
    email: "john.doe@example.com",
    phone: "+62 812 3456 7890",
    gender: "male",
    pob: "Jakarta",
    dob: "1990-01-15",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const dummyAddresses: Address[] = [
    {
      id: 1,
      user_id: 1,
      phone: "+62 812 3456 7890",
      province: "DKI Jakarta",
      region: "Jakarta Selatan",
      district: "Kebayoran Baru",
      village: "Senayan",
      post_code: "12190",
      note: "Rumah warna putih, pagar hitam",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const dummyOrders: Order[] = [
    {
      id: 1,
      order_uuid: "ORD-2024-001",
      total_amount: 850000,
      status: "shipped",
      note: "Please deliver before 5 PM",
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 2,
      order_uuid: "ORD-2024-002",
      total_amount: 1250000,
      status: "completed",
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const displayUser = user || dummyUser;
  const displayAddresses = addresses.length > 0 ? addresses : dummyAddresses;
  const displayOrders = orders.length > 0 ? orders : dummyOrders;

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-neutral-200">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm">
            <a href="/" className="text-neutral-500 hover:text-black">
              Home
            </a>
            <span className="text-neutral-400">/</span>
            <span className="text-black">My Account</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black sm:text-4xl">
            My Account
          </h1>
          <p className="mt-2 text-neutral-600">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Content */}
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <AccountSidebar
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeSection === "info" && (
              <BasicInfoSection user={displayUser} onUpdate={handleUpdateInfo} />
            )}
            {activeSection === "address" && (
              <AddressSection
                addresses={displayAddresses}
                onAdd={handleAddAddress}
                onUpdate={handleUpdateAddress}
              />
            )}
            {activeSection === "password" && (
              <PasswordSection onUpdate={handleUpdatePassword} />
            )}
            {activeSection === "orders" && (
              <OrdersSection orders={displayOrders} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

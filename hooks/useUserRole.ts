"use client";

import { useSession } from "next-auth/react";

export function useUserRole() {
  const { data: session } = useSession();

  const hasRole = (roleName: string): boolean => {
    if (!session?.user?.roles) return false;
    return session.user.roles.some(
      (role) => role.name.toLowerCase() === roleName.toLowerCase()
    );
  };

  const isAdmin = (): boolean => {
    return hasRole("admin") || hasRole("administrator");
  };

  const isCustomer = (): boolean => {
    return hasRole("customer") || hasRole("user");
  };

  const getDashboardUrl = (): string => {
    if (isAdmin()) {
      return "/dashboard";
    }
    return "/profile";
  };

  return {
    session,
    hasRole,
    isAdmin,
    isCustomer,
    getDashboardUrl,
    roles: session?.user?.roles || [],
  };
}

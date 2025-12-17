"use client";

import { CategoryProvider } from "@/features/categories/context/category-context";
import { PermissionProvider } from "@/features/permissions/context/permission-context";
import { ProductProvider } from "@/features/products/context/product-context";
import { RoleProvider } from "@/features/roles/context/role-context";
import { UserProvider } from "@/features/users/context/user-context";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <PermissionProvider>
        <RoleProvider>
          <UserProvider>
            <CategoryProvider>
              <ProductProvider>{children}</ProductProvider>
            </CategoryProvider>
          </UserProvider>
        </RoleProvider>
      </PermissionProvider>
    </SessionProvider>
  );
}

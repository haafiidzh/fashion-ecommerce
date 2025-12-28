"use client";

import { CategoryProvider } from "@/features/categories/context/category-context";
import { PermissionProvider } from "@/features/permissions/context/permission-context";
import { ProductProvider } from "@/features/products/context/product-context";
import { RoleProvider } from "@/features/roles/context/role-context";
import { UserProvider } from "@/features/users/context/user-context";
import { CartProvider } from "@/features/cart/context/cart-context";
import { SessionProvider } from "next-auth/react";
import {ShopProvider} from "@/features/shop";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <PermissionProvider>
        <RoleProvider>
          <UserProvider>
            <CategoryProvider>
              <ProductProvider>
                <CartProvider>
                  <ShopProvider>
                      {children}
                  </ShopProvider>
                </CartProvider>
              </ProductProvider>
            </CategoryProvider>
          </UserProvider>
        </RoleProvider>
      </PermissionProvider>
    </SessionProvider>
  );
}

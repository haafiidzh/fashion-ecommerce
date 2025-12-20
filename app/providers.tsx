"use client";

import { SessionProvider } from "next-auth/react";
import {ShopProvider} from "@/features/shop/context/shop-context";
import {ProductProvider} from "@/features/products/context/product-context";
import {CategoryProvider} from "@/features/categories/context/category-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
      <SessionProvider>
          <ShopProvider>
              <ProductProvider>
                  <CategoryProvider>
                      {children}
                  </CategoryProvider>
              </ProductProvider>
          </ShopProvider>
      </SessionProvider>
  )
}

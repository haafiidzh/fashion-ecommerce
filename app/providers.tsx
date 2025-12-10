"use client";

import { SessionProvider } from "next-auth/react";
import {CategoryProvider} from "@/features/categories/context/category-context";
import {ProductProvider} from "@/features/products/context/product-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
      <SessionProvider>
        <CategoryProvider>
           <ProductProvider>
            {children}
          </ProductProvider>
        </CategoryProvider>
      </SessionProvider>
  )
}

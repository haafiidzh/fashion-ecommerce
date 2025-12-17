"use client";

import React from "react";
import ProductList from "@/features/products/components/product-list";

export default function ProductsPages() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ProductList />
    </div>
  );
}
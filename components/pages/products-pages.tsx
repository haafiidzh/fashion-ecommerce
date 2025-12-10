'use client';

import React from 'react';
import ProductList from '@/features/products/components/product-list';
import { ProductProvider } from '@/features/products/context/product-context';

export default function ProductsPages() {
    return (
        <ProductProvider>
            <div className="container mx-auto px-4 py-8">
                <ProductList />
            </div>
        </ProductProvider>
    );
}
import React from "react";

export interface Product {
    id: number;
    category_id: number;
    name: string;
    slug?: string;
    price?: number;
    images?: ProductImage[];
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
    product_category?: {
        id: number;
        name: string;
    };
}

export interface ProductFormData {
    category_id: number;
    name: string;
    slug?: string;
    price?: number;
    images?: ProductImage[];
}

export interface ProductState {
    products: Product[];
    loading: boolean;
    error: string | null;
}

export interface ProductColumn {
    id: string;
    header: string;
    accessorKey?: string;
    cell?: (props: any) => React.ReactNode;
}

export interface ProductImage {
    id: string;
    url: string;
    public_id: string;
    alt?: string;
}
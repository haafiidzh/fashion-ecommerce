'use client';

import { useState, useEffect } from 'react';
import { productApi } from '@/data/products';
import { Product, ProductFormData } from '@/features/products/types/product-types';

export const useProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await productApi.getProducts();
            setProducts(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const createProduct = async (data: ProductFormData): Promise<Product> => {
        try {
            const newProduct = await productApi.createProduct(data);
            setProducts(prev => [...prev, newProduct]);
            return newProduct;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create product');
            throw err;
        }
    };

    const updateProduct = async (id: number, data: ProductFormData): Promise<Product> => {
        try {
            const updatedProduct = await productApi.updateProduct(id, data);
            setProducts(prev =>
                prev.map(product =>
                    product.id === id ? updatedProduct : product
                )
            );
            return updatedProduct;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update product');
            throw err;
        }
    };

    const deleteProduct = async (id: number): Promise<void> => {
        try {
            await productApi.deleteProduct(id);
            setProducts(prev => prev.filter(product => product.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete product');
            throw err;
        }
    };

    const clearError = () => setError(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    return {
        products,
        loading,
        error,
        fetchProducts,
        createProduct,
        updateProduct,
        deleteProduct,
        clearError,
    };
};

export const useProductById = (id: number): Product | null => {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await productApi.getProductById(id);
                setProduct(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch product');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    return product;
};
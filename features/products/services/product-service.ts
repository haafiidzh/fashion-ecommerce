import apiClient from '@/lib/api-client';
import { Product, ProductFormData } from '@/features/products/types/product-types';

export const productApi = {
    getProducts: async (): Promise<Product[]> => {
        const response = await apiClient.get('/products');
        return response.data;
    },

    getProductById: async (id: number): Promise<Product> => {
        const response = await apiClient.get(`/products/${id}`);
        return response.data;
    },

    createProduct: async (data: ProductFormData): Promise<Product> => {
        const { name, price, category_id, images } = data;
        const response = await apiClient.post('/products', {
            name,
            price: price?.toString(),
            category_id,
            images
        });
        return response.data;
    },

    updateProduct: async (id: number, data: ProductFormData): Promise<Product> => {
        const { name, price, category_id, images } = data;
        const response = await apiClient.put(`/products/${id}`, {
            name,
            price: price?.toString(),
            category_id,
            images
        });
        return response.data;
    },

    deleteProduct: async (id: number): Promise<void> => {
        await apiClient.delete(`/products/${id}`);
    },
};
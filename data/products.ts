import { Product, ProductFormData } from '@/features/products/types/product-types';
import apiClient from '@/lib/api-client';

export const productApi = {
    async getProducts(): Promise<Product[]> {
        return [
            {
                id: 1,
                category_id: 1,
                name: "Laptop Gaming",
                slug: "laptop-gaming",
                price: 15000000,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                product_category: {
                    id: 1,
                    name: "Electronics"
                }
            },
            {
                id: 2,
                category_id: 2,
                name: "Office Chair",
                slug: "office-chair",
                price: 2500000,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                product_category: {
                    id: 2,
                    name: "Furniture"
                }
            },
            {
                id: 3,
                category_id: 1,
                name: "Smartphone",
                slug: "smartphone",
                price: 8000000,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                product_category: {
                    id: 1,
                    name: "Electronics"
                }
            }
        ];

        // const response = await apiClient.get('/products');
        // return response.data;
    },

    async getProductById(id: number): Promise<Product | null> {
        const products = await this.getProducts();
        return products.find(product => product.id === id) || null;

        // const response = await apiClient.get(`/products/${id}`);
        // return response.data;
    },

    async createProduct(data: ProductFormData): Promise<Product> {
        const newProduct: Product = {
            id: Math.floor(Math.random() * 1000),
            ...data,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        return newProduct;

        // const response = await apiClient.post('/products', data);
        // return response.data;
    },

    async updateProduct(id: number, data: Partial<ProductFormData>): Promise<Product> {
        const products = await this.getProducts();
        const productIndex = products.findIndex(product => product.id === id);

        if (productIndex === -1) {
            throw new Error('Product not found');
        }

        const updatedProduct = {
            ...products[productIndex],
            ...data,
            updated_at: new Date().toISOString(),
        };

        return updatedProduct;

        // const response = await apiClient.put(`/products/${id}`, data);
        // return response.data;
    },

    async deleteProduct(id: number): Promise<void> {
        const products = await this.getProducts();
        const productIndex = products.findIndex(product => product.id === id);

        if (productIndex === -1) {
            throw new Error('Product not found');
        }

        return;

        // await apiClient.delete(`/products/${id}`);
    },
};
import { Product, ProductFormData } from '../types/product-types';
import { productApi } from '@/data/products';

class ProductService {
    async getProducts(): Promise<Product[]> {
        return productApi.getProducts();
    }

    async getProductById(id: number): Promise<Product | null> {
        return productApi.getProductById(id);
    }

    async createProduct(data: ProductFormData): Promise<Product> {
        return productApi.createProduct(data);
    }

    async updateProduct(id: number, data: Partial<ProductFormData>): Promise<Product> {
        return productApi.updateProduct(id, data);
    }

    async deleteProduct(id: number): Promise<void> {
        return productApi.deleteProduct(id);
    }
}

export default new ProductService();
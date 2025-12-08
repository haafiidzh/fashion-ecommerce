import { Category, CategoryFormData } from '../types/category-types';
import { categoryApi } from '@/data/categories';

class CategoryService {
    async getCategories(): Promise<Category[]> {
        return categoryApi.getCategories();
    }

    async getCategoryById(id: number): Promise<Category | null> {
        return categoryApi.getCategoryById(id);
    }

    async createCategory(data: CategoryFormData): Promise<Category> {
        return categoryApi.createCategory(data.name);
    }

    async updateCategory(id: number, data: Partial<CategoryFormData>): Promise<Category> {
        return categoryApi.updateCategory(id, data.name || '');
    }

    async deleteCategory(id: number): Promise<void> {
        return categoryApi.deleteCategory(id);
    }
}

export default new CategoryService();
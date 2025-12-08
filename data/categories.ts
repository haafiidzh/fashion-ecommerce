export interface Category {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export const categoriesData: Category[] = [
    {
        id: 1,
        name: 'Baju',
        created_at: '2023-01-15T08:30:00Z',
        updated_at: '2023-05-10T14:22:00Z',
        deleted_at: null,
    },
    {
        id: 2,
        name: 'Celana',
        created_at: '2023-01-20T10:15:00Z',
        updated_at: '2023-04-25T09:18:00Z',
        deleted_at: null,
    },
    {
        id: 3,
        name: 'Jaket',
        created_at: '2023-02-05T16:45:00Z',
        updated_at: '2023-05-12T11:30:00Z',
        deleted_at: null,
    },
    {
        id: 4,
        name: 'Sports & Outdoors',
        created_at: '2023-02-18T13:20:00Z',
        updated_at: '2023-05-08T16:45:00Z',
        deleted_at: null,
    },
    {
        id: 5,
        name: 'Baju Tidur',
        created_at: '2023-03-01T09:10:00Z',
        updated_at: '2023-05-15T12:05:00Z',
        deleted_at: null,
    },
    {
        id: 6,
        name: 'Baju Islami',
        created_at: '2023-03-12T14:35:00Z',
        updated_at: '2023-05-11T10:20:00Z',
        deleted_at: null,
    }
];

export const categoryApi = {
    getCategories: async (includeDeleted = false): Promise<Category[]> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const categories = [...categoriesData];
        return includeDeleted ? categories : categories.filter(c => !c.deleted_at);
    },

    getCategoryById: async (id: number): Promise<Category | null> => {
        await new Promise(resolve => setTimeout(resolve, 300));
        return categoriesData.find(category => category.id === id && !category.deleted_at) || null;
    },

    createCategory: async (name: string): Promise<Category> => {
        await new Promise(resolve => setTimeout(resolve, 500));

        const newCategory: Category = {
            id: Math.max(...categoriesData.map(c => c.id)) + 1,
            name,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            deleted_at: null,
        };

        categoriesData.push(newCategory);
        return newCategory;
    },

    updateCategory: async (id: number, name: string): Promise<Category> => {
        await new Promise(resolve => setTimeout(resolve, 500));

        const categoryIndex = categoriesData.findIndex(c => c.id === id);
        if (categoryIndex === -1) {
            throw new Error('Category not found');
        }

        categoriesData[categoryIndex] = {
            ...categoriesData[categoryIndex],
            name,
            updated_at: new Date().toISOString(),
        };

        return categoriesData[categoryIndex];
    },

    deleteCategory: async (id: number): Promise<void> => {
        await new Promise(resolve => setTimeout(resolve, 500));

        const categoryIndex = categoriesData.findIndex(c => c.id === id);
        if (categoryIndex === -1) {
            throw new Error('Category not found');
        }

        categoriesData[categoryIndex].deleted_at = new Date().toISOString();
    },

    restoreCategory: async (id: number): Promise<Category> => {
        await new Promise(resolve => setTimeout(resolve, 500));

        const categoryIndex = categoriesData.findIndex(c => c.id === id);
        if (categoryIndex === -1) {
            throw new Error('Category not found');
        }

        categoriesData[categoryIndex].deleted_at = null;
        categoriesData[categoryIndex].updated_at = new Date().toISOString();

        return categoriesData[categoryIndex];
    },
};
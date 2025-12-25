export interface Category {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface CategoryFormData {
    name: string;
}

export interface CategoryState {
    categories: Category[];
    loading: boolean;
    error: string | null
}

export interface CategoryColumn {
    id: string;
    header: string;
    accessorKey?: string;
    cell?: (props: any) => React.ReactNode;
}
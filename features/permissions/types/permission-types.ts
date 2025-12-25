export interface Permission {
    id: number;
    name: string;
    guard: string;
    created_at: string;
    updated_at: string;
}

export interface PermissionState {
    permissions: Permission[];
    loading: boolean;
}
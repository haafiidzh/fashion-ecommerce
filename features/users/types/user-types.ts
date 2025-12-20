import { Role } from "@/features/roles/types/role-types";

export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    phone: string | null;
    pob: string | null;
    dob: Date | null;
    gender: string | null;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    roles?: Role[] | null;
}

export interface UserRole {
    id: number;
    user_id: number;
    role_id: number;
    role: Role | null;
}
  
export interface UserState {
    users: User[],
    loading: boolean,
}
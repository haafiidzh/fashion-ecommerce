export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    phone: string;
    pob: string;
    dob: Date;
    gender: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
}
  
export interface UserState {
    users: User[],
    loading: boolean,
}
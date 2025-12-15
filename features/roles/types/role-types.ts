export interface Role {
    id: number;
    name: string;
    guard: string;
    created_at: string;
    updated_at: string;
}
  
export interface RoleState {
    roles: Role[],
    loading: boolean,
}
export interface Role {
    id: number;
    name: string;
    guard: string;
    created_at: Date;
    updated_at: Date;
}
  
export interface RoleState {
    roles: Role[],
    loading: boolean,
}
export interface UserAccount {
  id: number;
  username: string;
  email: string;
  phone?: string;
  pob?: string;
  dob?: Date | string;
  gender?: string;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface Address {
  id: number;
  user_id: number;
  phone?: string;
  province?: string;
  region?: string;
  district?: string;
  village?: string;
  post_code?: string;
  note?: string;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface Order {
  id: number;
  order_uuid: string;
  total_amount: number;
  status: "pending" | "processing" | "shipped" | "completed" | "cancelled";
  note?: string;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export type AccountSection = "info" | "address" | "password" | "orders";

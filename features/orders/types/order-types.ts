export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "completed"
  | "cancelled";

export interface Order {
  id: string; // order_uuid dari database
  customer: string;
  items: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
}


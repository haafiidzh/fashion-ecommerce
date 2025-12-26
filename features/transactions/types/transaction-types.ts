export type TransactionStatus = "pending" | "success";

export interface Transaction {
  id: number;
  orderId: string;
  method: string | null;
  amount: number;
  status: TransactionStatus;
  tracking_number?: string | null;
  createdAt: string;
}

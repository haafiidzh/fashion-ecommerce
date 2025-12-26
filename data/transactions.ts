import apiClient from "@/lib/api-client";
import type { Transaction } from "@/features/transactions/types/transaction-types";

export const transactionApi = {
  async getTransactions(): Promise<Transaction[]> {
    const response = await apiClient.get("/transactions");
    return response.data.data as Transaction[];
  },
};
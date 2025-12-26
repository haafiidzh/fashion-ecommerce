'use client';

import { useEffect, useState } from "react";
import { transactionApi } from "@/data/transactions";
import type { Transaction } from "@/features/transactions/types/transaction-types";

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await transactionApi.getTransactions();
      setTransactions(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch transactions from backend"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const clearError = () => setError(null);

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    clearError,
  };
};
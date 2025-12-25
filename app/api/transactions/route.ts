import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const transactions = await prisma.transactions.findMany({
      include: {
        orders: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    const data = transactions.map((tx) => ({
      id: tx.id,
      orderId: tx.orders.order_uuid,
      method: tx.payment_method !== null ? String(tx.payment_method) : "Unknown",
      amount: Number(tx.total_amount),
      status: tx.transaction_status ?? "pending",
      tracking_number: tx.tracking_number,
      createdAt: tx.created_at.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      message: "Transactions fetched successfully",
      data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "An unknown error occurred",
        data: null,
      },
      { status: 500 },
    );
  }
};

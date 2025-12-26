import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const orders = await prisma.orders.findMany({
      include: {
        users: true,
        order_items: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    const data = orders.map((order) => ({
      id: order.order_uuid,
      customer: order.users.username,
      items: order.order_items.length,
      total: Number(order.total_amount),
      status: order.status ?? "pending",
      createdAt: order.created_at.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      message: "Orders fetched successfully",
      data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
        data: null,
      },
      { status: 500 }
    );
  }
};


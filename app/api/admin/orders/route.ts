import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Check admin session (enable for production)
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.users.findUnique({
      where: { email: session.user.email },
      include: {
        user_roles: {
          include: {
            roles: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isAdmin = user.user_roles.some(ur => ur.roles.name === 'admin');
    if (!isAdmin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    // Fetch orders with full details for admin
    const orders = await prisma.orders.findMany({
      include: {
        users: {
          select: {
            username: true,
            email: true,
          }
        },
        order_items: {
          include: {
            products: {
              select: {
                name: true,
                price: true,
              }
            }
          }
        },
        transactions: {
          select: {
            payment_method: true,
            transaction_status: true,
          }
        }
      },
      orderBy: {
        created_at: "desc",
      },
    });

    const formattedOrders = orders.map(order => ({
      id: order.id,
      order_uuid: order.order_uuid,
      customer: order.users.username,
      customer_email: order.users.email,
      items: order.order_items.length,
      total: Number(order.total_amount),
      status: order.status || 'pending',
      payment_method: order.transactions?.[0]?.payment_method || null,
      transaction_status: order.transactions?.[0]?.transaction_status || null,
      createdAt: order.created_at.toISOString(),
      items_detail: order.order_items.map(item => ({
        product_name: item.products.name,
        quantity: item.quantity,
        price: Number(item.amount) / item.quantity,
        total: Number(item.amount)
      }))
    }));

    return NextResponse.json({
      success: true,
      message: "Admin orders fetched successfully",
      data: formattedOrders,
      total: formattedOrders.length
    });

  } catch (error) {
    console.error("Admin orders fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to fetch admin orders",
        data: null,
      },
      { status: 500 }
    );
  }
}

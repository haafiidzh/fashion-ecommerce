import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const whereClause = userId ? { user_id: parseInt(userId) } : {};

    const orders = await prisma.orders.findMany({
      where: whereClause,
      include: {
        users: true,
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
      },
      orderBy: {
        created_at: "desc",
      },
    });

    const data = orders.map((order) => ({
      id: order.id,
      order_uuid: order.order_uuid,
      customer: order.users.username,
      items: order.order_items.length,
      total_amount: Number(order.total_amount),
      status: order.status ?? "pending",
      created_at: order.created_at.toISOString(),
      updated_at: order.updated_at.toISOString(),
      items_detail: order.order_items.map(item => ({
        product_name: item.products.name,
        quantity: item.products.price ? Math.round(Number(item.amount) / Number(item.products.price)) : 1,
        price: item.products.price ? Number(item.products.price) : Number(item.amount),
        total: item.amount ? Number(item.amount) : 0
      }))
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

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { user_id, total_amount, items, shipping_address, payment_method } = body;

    // Generate order UUID
    const orderUuid = uuidv4();

    // Create order
    const order = await prisma.orders.create({
      data: {
        user_id: parseInt(user_id),
        order_uuid: orderUuid,
        total_amount: BigInt(total_amount),
        status: "pending",
        note: `Payment: ${payment_method}`,
      },
    });

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      name: item.name,
      amount: BigInt(item.price * item.quantity),
    }));

    await prisma.order_items.createMany({
      data: orderItems,
    });

    // Convert payment method string to integer
    // 1: bank_transfer, 2: e_wallet, 3: credit_card, 4: cod
    const paymentMethodMap: { [key: string]: number } = {
      'bank_transfer': 1,
      'e_wallet': 2,
      'credit_card': 3,
      'cod': 4
    };

    const paymentMethodInt = paymentMethodMap[payment_method] || 1;

    // Create transaction
    await prisma.transactions.create({
      data: {
        order_id: order.id,
        payment_method: paymentMethodInt,
        total_amount: BigInt(total_amount),
        transaction_status: "pending",
      },
    });

    // Clear user's cart after successful order
    const userCart = await prisma.carts.findUnique({
      where: { user_id: parseInt(user_id) }
    });

    if (userCart) {
      await prisma.cart_items.deleteMany({
        where: { cart_id: userCart.id }
      });
    }

    return NextResponse.json({
      success: true,
      message: "Order created successfully",
      order: {
        id: order.id,
        order_uuid: orderUuid,
        total_amount: total_amount,
        status: order.status,
      },
    });

  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to create order",
        data: null,
      },
      { status: 500 }
    );
  }
};

export const PUT = async (request: Request) => {
  try {
    const { id, status, note } = await request.json();

    if (!id || !status) {
      return NextResponse.json(
        { success: false, message: "Order ID and status are required" },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['pending', 'approved', 'rejected', 'processing', 'shipped', 'delivered', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 }
      );
    }

    // Update order status
    const updatedOrder = await prisma.orders.update({
      where: { id: parseInt(id) },
      data: {
        status: status as any,
        note: note || undefined,
        updated_at: new Date(),
      },
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
        }
      }
    });

    // Convert BigInt to number for JSON serialization
    const serializedOrder = {
      ...updatedOrder,
      total_amount: Number(updatedOrder.total_amount),
      order_items: updatedOrder.order_items.map(item => ({
        ...item,
        amount: Number(item.amount),
        products: {
          ...item.products,
          price: Number(item.products.price)
        }
      }))
    };

    return NextResponse.json({
      success: true,
      message: "Order status updated successfully",
      data: serializedOrder,
    });

  } catch (error) {
    console.error("Order update error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to update order",
        data: null,
      },
      { status: 500 }
    );
  }
};


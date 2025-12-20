import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = parseInt(id);
    if (isNaN(userId)) {
      return NextResponse.json(
        { success: false, message: "Invalid ID format", data: null },
        { status: 400 }
      );
    }

    let cart = await prisma.carts.findUnique({
      where: { user_id: userId },
      include: {
        cart_items: {
          select: {
            id: true,
            cart_id: true,
            product_id: true,
            quantity: true,
            created_at: true,
            updated_at: true,
            products: {
              include: {
                product_category: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      const newCart = await prisma.carts.create({
        data: { user_id: userId },
      });
      
      cart = await prisma.carts.findUnique({
        where: { id: newCart.id },
        include: {
          cart_items: {
            select: {
              id: true,
              cart_id: true,
              product_id: true,
              quantity: true,
              created_at: true,
              updated_at: true,
              products: {
                include: {
                  product_category: true,
                },
              },
            },
          },
        },
      });
    }


    return NextResponse.json({
      success: true,
      message: "Cart fetched successfully",
      data: cart,
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
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = parseInt(id);
    if (isNaN(userId)) {
      return NextResponse.json(
        { success: false, message: "Invalid ID format", data: null },
        { status: 400 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request body",
          data: null,
        },
        { status: 400 }
      );
    }

    const { productId, quantity } = body;

    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          message: "Product ID is required",
          data: null,
        },
        { status: 400 }
      );
    }

    let quantityValue = 1;
    if (quantity !== undefined && quantity !== null) {
      quantityValue = Number(quantity);
      if (isNaN(quantityValue)) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid quantity. Quantity must be a valid number.",
            data: null,
          },
          { status: 400 }
        );
      }
    }

    let cart = await prisma.carts.findUnique({
      where: { user_id: userId },
    });

    if (!cart) {
      cart = await prisma.carts.create({
        data: { user_id: userId },
      });
    }

    const existingCartItem = await prisma.cart_items.findFirst({
      where: {
        cart_id: cart.id,
        product_id: productId,
      },
    });

    if (existingCartItem) {
      const newQuantity = existingCartItem.quantity + quantityValue;
      if (newQuantity <= 0) {
        await prisma.cart_items.delete({
          where: { id: existingCartItem.id },
        });
      } else {
        await prisma.cart_items.update({
          where: { id: existingCartItem.id },
          data: {
            quantity: newQuantity,
          },
        });
      }
    } else {
      if (quantityValue > 0) {
        await prisma.cart_items.create({
          data: {
            cart_id: cart.id,
            product_id: productId,
            quantity: quantityValue,
          },
        });
      }
    }

    const updatedCart = await prisma.carts.findUnique({
      where: { id: cart.id },
      include: {
        cart_items: {
          select: {
            id: true,
            cart_id: true,
            product_id: true,
            quantity: true,
            created_at: true,
            updated_at: true,
            products: {
              include: {
                product_category: true,
              },
            },
          },
        },
      },
    });

    if (!updatedCart) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to retrieve updated cart",
          data: null,
        },
        { status: 500 }
      );
    }


    return NextResponse.json({
      success: true,
      message: "Item added to cart successfully",
      data: updatedCart,
    });
  } catch (error) {
    console.error("Error in POST /api/cart/[id]:", error);
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
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = parseInt(id);
    if (isNaN(userId)) {
      return NextResponse.json(
        { success: false, message: "Invalid ID format", data: null },
        { status: 400 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request body",
          data: null,
        },
        { status: 400 }
      );
    }

    const { productId, quantity } = body;

    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          message: "Product ID is required",
          data: null,
        },
        { status: 400 }
      );
    }

    let quantityValue = Number(quantity);
    if (isNaN(quantityValue) || quantityValue <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid quantity. Quantity must be a positive number.",
          data: null,
        },
        { status: 400 }
      );
    }

    let cart = await prisma.carts.findUnique({
      where: { user_id: userId },
    });

    if (!cart) {
      return NextResponse.json(
        {
          success: false,
          message: "Cart not found",
          data: null,
        },
        { status: 404 }
      );
    }

    const existingCartItem = await prisma.cart_items.findFirst({
      where: {
        cart_id: cart.id,
        product_id: productId,
      },
    });

    if (!existingCartItem) {
      return NextResponse.json(
        {
          success: false,
          message: "Cart item not found",
          data: null,
        },
        { status: 404 }
      );
    }

    await prisma.cart_items.update({
      where: { id: existingCartItem.id },
      data: {
        quantity: quantityValue,
      },
    });

    const updatedCart = await prisma.carts.findUnique({
      where: { id: cart.id },
      include: {
        cart_items: {
          select: {
            id: true,
            cart_id: true,
            product_id: true,
            quantity: true,
            created_at: true,
            updated_at: true,
            products: {
              include: {
                product_category: true,
              },
            },
          },
        },
      },
    });

    if (!updatedCart) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to retrieve updated cart",
          data: null,
        },
        { status: 500 }
      );
    }


    return NextResponse.json({
      success: true,
      message: "Cart item quantity updated successfully",
      data: updatedCart,
    });
  } catch (error) {
    console.error("Error in PUT /api/cart/[id]:", error);
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
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = parseInt(id);
    if (isNaN(userId)) {
      return NextResponse.json(
        { success: false, message: "Invalid ID format", data: null },
        { status: 400 }
      );
    }

    let requestBody;
    try {
      requestBody = await request.json();
    } catch {
      requestBody = {};
    }

    const { productId } = requestBody;

    const cart = await prisma.carts.findUnique({
      where: { user_id: userId },
      include: {
        cart_items: true,
      },
    });

    if (!cart) {
      return NextResponse.json({
        success: true,
        message: "Cart not found",
        data: null,
      });
    }

    if (productId) {
      const cartItem = await prisma.cart_items.findFirst({
        where: {
          cart_id: cart.id,
          product_id: productId,
        },
      });

      if (!cartItem) {
        return NextResponse.json(
          {
            success: false,
            message: "Cart item not found",
            data: null,
          },
          { status: 404 }
        );
      }

      await prisma.cart_items.delete({
        where: { id: cartItem.id },
      });

      const updatedCart = await prisma.carts.findUnique({
        where: { id: cart.id },
        include: {
          cart_items: {
            select: {
              id: true,
              cart_id: true,
              product_id: true,
              quantity: true,
              created_at: true,
              updated_at: true,
              products: {
                include: {
                  product_category: true,
                },
              },
            },
          },
        },
      });

      return NextResponse.json({
        success: true,
        message: "Item removed from cart successfully",
        data: updatedCart,
      });
    } else {
      await prisma.cart_items.deleteMany({
        where: { cart_id: cart.id },
      });

      await prisma.carts.delete({
        where: { id: cart.id },
      });

      return NextResponse.json({
        success: true,
        message: "Cart cleared successfully",
        data: null,
      });
    }
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
}
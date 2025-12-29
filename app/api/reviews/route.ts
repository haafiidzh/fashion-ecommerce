import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const productId = searchParams.get('productId');
    const userId = searchParams.get('userId');

    let whereClause: any = {};

    if (orderId) {
      whereClause.order_id = parseInt(orderId);
    }

    if (userId) {
      whereClause.users = { id: parseInt(userId) };
    } else if (session?.user?.id && !productId) {
      // If user is logged in and not requesting product reviews, show only their reviews
      whereClause.users = { id: parseInt(session.user.id) };
    }

    if (productId) {
      // Get reviews for specific product
      const reviews = await prisma.review_details.findMany({
        where: { product_id: parseInt(productId) },
        include: {
          reviews: {
            include: {
              users: {
                select: { username: true }
              },
              orders: {
                select: { id: true, order_uuid: true }
              }
            }
          },
          products: {
            select: { name: true }
          }
        },
        orderBy: { created_at: "desc" }
      });

      const formattedReviews = reviews.map(review => ({
        id: review.id,
        order_id: review.reviews.order_id,
        order_uuid: review.reviews.orders.order_uuid,
        product_id: review.product_id,
        product_name: review.products.name,
        customer_name: review.reviews.users.username,
        rating: review.rating,
        comment: review.comment,
        created_at: review.created_at.toISOString(),
      }));

      return NextResponse.json({
        success: true,
        reviews: formattedReviews,
      });
    }

    // Get all reviews or reviews for specific order
    const reviews = await prisma.reviews.findMany({
      where: whereClause,
      include: {
        users: {
          select: { username: true }
        },
        orders: {
          select: { order_uuid: true }
        },
        review_details: {
          include: {
            products: {
              select: { name: true }
            }
          }
        }
      },
      orderBy: { created_at: "desc" }
    });

    const formattedReviews = reviews.map(review => ({
      id: review.id,
      order_id: review.order_id,
      order_uuid: review.orders.order_uuid,
      customer_name: review.users.username,
      rating: review.rating,
      comment: review.comment,
      created_at: review.created_at.toISOString(),
      products: review.review_details.map(detail => ({
        product_id: detail.product_id,
        product_name: detail.products.name,
        rating: detail.rating,
        comment: detail.comment,
      }))
    }));

    return NextResponse.json({
      success: true,
      reviews: formattedReviews,
    });

  } catch (error) {
    console.error("Reviews fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { order_id, rating, comment, product_reviews } = body;

    if (!order_id) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    // Check if order exists and belongs to user
    const order = await prisma.orders.findFirst({
      where: {
        id: parseInt(order_id),
        user_id: parseInt(session.user.id),
        status: "delivered" // Only allow review for delivered orders
      },
      include: {
        order_items: {
          include: {
            products: true
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found or not eligible for review" }, { status: 404 });
    }

    // Check if user already reviewed this order
    const existingReview = await prisma.reviews.findFirst({
      where: {
        order_id: parseInt(order_id),
        user_id: parseInt(session.user.id)
      }
    });

    if (existingReview) {
      return NextResponse.json({ error: "You have already reviewed this order" }, { status: 400 });
    }

    // Create main review
    const review = await prisma.reviews.create({
      data: {
        user_id: parseInt(session.user.id),
        order_id: parseInt(order_id),
        rating: rating || null,
        comment: comment || null,
        value: comment || "", // Backward compatibility
      }
    });

    // Create review details for each product
    if (product_reviews && Array.isArray(product_reviews)) {
      const reviewDetails = product_reviews.map((pr: any) => ({
        review_id: review.id,
        product_id: pr.product_id,
        rating: pr.rating,
        comment: pr.comment || null,
      }));

      await prisma.review_details.createMany({
        data: reviewDetails
      });
    } else {
      // Create review details for all products in order with default rating
      const reviewDetails = order.order_items.map(item => ({
        review_id: review.id,
        product_id: item.product_id,
        rating: rating || 5, // Default rating if not specified
        comment: comment || null,
      }));

      await prisma.review_details.createMany({
        data: reviewDetails
      });
    }

    return NextResponse.json({
      success: true,
      message: "Review submitted successfully",
      review: {
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        created_at: review.created_at.toISOString(),
      }
    }, { status: 201 });

  } catch (error) {
    console.error("Review creation error:", error);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}

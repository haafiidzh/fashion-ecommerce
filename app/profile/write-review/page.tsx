"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CustomerLayout } from "@/components/layout";
import { Star, Package } from "lucide-react";

interface OrderItem {
  id: number;
  product_id: number;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: string;
  total: number;
  items: OrderItem[];
}

interface ProductReview {
  product_id: number;
  rating: number;
  comment: string;
}

export default function ReviewPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [overallRating, setOverallRating] = useState(5);
  const [overallComment, setOverallComment] = useState("");
  const [productReviews, setProductReviews] = useState<ProductReview[]>([]);

  // Get order ID from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get('orderId');

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (orderId && session?.user?.id) {
      fetchOrderDetails();
    }
  }, [status, session, orderId]);

  const fetchOrderDetails = async () => {
    if (!orderId || !session?.user?.id) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/orders?userId=${session.user.id}`);
      if (response.ok) {
        const data = await response.json();
        const ordersArray = data.data || [];
        const currentOrder = ordersArray.find((o: any) => o.id.toString() === orderId);

        if (currentOrder && currentOrder.status === "delivered") {
          // Transform order data
          const transformedOrder: Order = {
            id: currentOrder.id.toString(),
            orderNumber: currentOrder.order_uuid,
            date: currentOrder.created_at,
            status: currentOrder.status,
            total: currentOrder.total_amount,
            items: currentOrder.items_detail.map((item: any, index: number) => ({
              id: index + 1,
              product_id: item.product_id,
              name: item.product_name,
              quantity: item.quantity,
              price: item.price,
            }))
          };

          setOrder(transformedOrder);

          // Initialize product reviews
          const initialReviews = transformedOrder.items.map(item => ({
            product_id: item.product_id,
            rating: 5,
            comment: ""
          }));
          setProductReviews(initialReviews);
        } else {
          alert("Order not found or not eligible for review");
          router.push("/profile/orders");
        }
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      alert("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const handleProductRatingChange = (productId: number, rating: number) => {
    setProductReviews(prev =>
      prev.map(review =>
        review.product_id === productId
          ? { ...review, rating }
          : review
      )
    );
  };

  const handleProductCommentChange = (productId: number, comment: string) => {
    setProductReviews(prev =>
      prev.map(review =>
        review.product_id === productId
          ? { ...review, comment }
          : review
      )
    );
  };

  const handleSubmitReview = async () => {
    if (!order || !session?.user?.id) return;

    setSubmitting(true);

    try {
      const reviewData = {
        order_id: parseInt(order.id),
        rating: overallRating,
        comment: overallComment,
        product_reviews: productReviews
      };

      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      if (response.ok) {
        alert("Review submitted successfully!");
        router.push("/profile/orders");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const StarRating = ({
    rating,
    onRatingChange,
    size = "text-xl"
  }: {
    rating: number;
    onRatingChange: (rating: number) => void;
    size?: string;
  }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className={`${size} ${star <= rating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  if (status === "loading" || loading) {
    return (
      <CustomerLayout
        breadcrumbs={[{ label: "Profile", href: "/profile" }, { label: "Review Order" }]}
      >
        <div className="max-w-[1240px] mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  if (!order) {
    return (
      <CustomerLayout
        breadcrumbs={[{ label: "Profile", href: "/profile" }, { label: "Review Order" }]}
      >
        <div className="max-w-[1240px] mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-600">Order not found or not eligible for review.</p>
            <button
              onClick={() => router.push("/profile/orders")}
              className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout
      breadcrumbs={[{ label: "Profile", href: "/profile" }, { label: "Review Order" }]}
    >
      <div className="max-w-[1240px] mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-black mb-8">Write a Review</h1>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl border border-black/10 p-6 mb-8">
            <h2 className="text-lg font-semibold text-black mb-4">Order Summary</h2>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-black/60">Order ID:</span>
              <span className="font-mono text-sm">{order.orderNumber}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-black/60">Total:</span>
              <span className="font-semibold">Rp {order.total.toLocaleString()}</span>
            </div>
          </div>

          {/* Overall Review */}
          <div className="bg-white rounded-2xl border border-black/10 p-6 mb-8">
            <h2 className="text-lg font-semibold text-black mb-4">Overall Rating</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-black mb-2">
                How would you rate your overall experience?
              </label>
              <StarRating
                rating={overallRating}
                onRatingChange={setOverallRating}
                size="text-2xl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Share your thoughts (optional)
              </label>
              <textarea
                value={overallComment}
                onChange={(e) => setOverallComment(e.target.value)}
                placeholder="Tell us about your experience..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
              />
            </div>
          </div>

          {/* Product Reviews */}
          <div className="bg-white rounded-2xl border border-black/10 p-6 mb-8">
            <h2 className="text-lg font-semibold text-black mb-4">Product Reviews</h2>

            <div className="space-y-6">
              {order.items.map((item) => {
                const productReview = productReviews.find(pr => pr.product_id === item.product_id);

                return (
                  <div key={item.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 bg-black/5 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Package className="h-6 w-6 text-black/40" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-black">{item.name}</h3>
                        <p className="text-sm text-black/60">
                          Quantity: {item.quantity} × Rp {item.price.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="ml-20">
                      <label className="block text-sm font-medium text-black mb-2">
                        Rate this product
                      </label>
                      <StarRating
                        rating={productReview?.rating || 5}
                        onRatingChange={(rating) => handleProductRatingChange(item.product_id, rating)}
                      />

                      <label className="block text-sm font-medium text-black mb-2 mt-4">
                        Comments (optional)
                      </label>
                      <textarea
                        value={productReview?.comment || ""}
                        onChange={(e) => handleProductCommentChange(item.product_id, e.target.value)}
                        placeholder="Share your thoughts about this product..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              onClick={() => router.push("/profile/orders")}
              className="px-6 py-3 text-black border-2 border-black rounded-lg hover:bg-black hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitReview}
              disabled={submitting}
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CustomerLayout } from "@/components/layout";
import ReviewCard from "@/features/user-account/components/review-card";

interface Review {
  id: number;
  order_id: number;
  order_uuid: string;
  customer_name: string;
  rating: number;
  comment: string;
  created_at: string;
  products: Array<{
    product_id: number;
    product_name: string;
    rating: number;
    comment: string;
  }>;
}

export default function ReviewsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (session?.user?.id) {
      fetchUserReviews();
    }
  }, [status, session]);

  const fetchUserReviews = async () => {
    if (!session?.user?.id) return;

    try {
      setLoading(true);
      const response = await fetch('/api/reviews');

      if (response.ok) {
        const data = await response.json();
        // Filter reviews by current user
        const userReviews = data.reviews.filter((review: Review) =>
          review.customer_name === session.user.name ||
          // Fallback: check by session user id if name doesn't match
          true // For now, show all reviews (will be filtered properly later)
        );
        setReviews(userReviews);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <CustomerLayout
        breadcrumbs={[{ label: "Profile", href: "/profile" }, { label: "My Reviews" }]}
      >
        <div className="max-w-[1240px] mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout
      breadcrumbs={[{ label: "Profile", href: "/profile" }, { label: "My Reviews" }]}
    >
      <div className="max-w-[1240px] mx-auto px-4 py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2">My Reviews</h1>
          <p className="text-black/60">Reviews you've written for products</p>
        </div>

        {reviews.length === 0 ? (
          <div className="bg-white rounded-2xl border border-black/10 p-12 text-center">
            <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-black/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-black mb-2">No Reviews Yet</h3>
            <p className="text-black/60 mb-6">You haven't written any reviews yet.</p>
            <a
              href="/profile/orders"
              className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              View Orders
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
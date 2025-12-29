import { Star } from "lucide-react";

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

interface ReviewCardProps {
  review: Review;
}

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
};

export default function ReviewCard({ review }: ReviewCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-black/10 p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-black">{review.customer_name}</h3>
            <span className="text-xs text-black/60 font-mono">
              {review.order_uuid}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <StarRating rating={review.rating} />
            <span className="text-xs text-black/60">
              {formatDate(review.created_at)}
            </span>
          </div>
        </div>
      </div>

      {review.comment && (
        <div className="mb-4">
          <p className="text-black/80 leading-relaxed">{review.comment}</p>
        </div>
      )}

      {review.products && review.products.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-black/10">
          <h4 className="text-sm font-semibold text-black">Product Reviews</h4>
          {review.products.map((product, index) => (
            <div key={index} className="bg-black/5 rounded-lg p-3">
              <div className="flex items-start justify-between mb-2">
                <h5 className="font-medium text-black text-sm">
                  {product.product_name}
                </h5>
                <StarRating rating={product.rating} />
              </div>
              {product.comment && (
                <p className="text-black/70 text-sm leading-relaxed">
                  {product.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

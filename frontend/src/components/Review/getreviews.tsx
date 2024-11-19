// src/components/GetReviews.tsx
import { Trash2 } from "lucide-react";
import { Updatereview } from "./update-review";
import { useGetReviewByIdQuery } from "../../api/review/query";
import { useDeleteReview } from "./deletereview";

export const GetReviews = ({
  bookId,
  refetch,
}: {
  bookId: string;
  refetch: () => void;
}) => {
  const { data: reviewsData, isLoading } = useGetReviewByIdQuery(bookId);
  const handleDelete = useDeleteReview();

  return (
    <div className="flex-1 overflow-y-auto mb-2">
      {isLoading ? (
        <p className="text-gray-500">Loading reviews...</p>
      ) : reviewsData?.data && reviewsData.data.length > 0 ? (
        reviewsData.data.map((review) => (
          <div key={review._id} className="mb-3 bg-gray-50 p-3 rounded-lg hover:shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold">
                  {review.username || "Anonymous"}
                </p>
                <p className="text-sm text-yellow-500">
                  {"★".repeat(review.rating)} {"☆".repeat(5 - review.rating)}
                </p>
              </div>
              <span className="flex gap-2">
                <Updatereview review={review} onUpdateSuccess={refetch} />
                <button
                  onClick={() => handleDelete(review._id, refetch)} // Delete review
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={16} />
                </button>
              </span>
            </div>
            <div className="mt-1">
              <p className="text-sm">{review.reviewText}</p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No reviews yet. Be the first to review!</p>
      )}
    </div>
  );
};

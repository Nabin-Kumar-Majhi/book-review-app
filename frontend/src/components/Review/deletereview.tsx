/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useDeleteReview.ts
import { useDeleteReviewMutation } from "../../api/review/query";
import { errorToast, successToast } from "../toaster";

export const useDeleteReview = () => {
  const deleteReviewMutation = useDeleteReviewMutation();

  const handleDelete = async (ReviewId: string, refetch: () => void) => {
    try {
      await deleteReviewMutation.mutateAsync(
        { ReviewId },
        {
          onSuccess() {
            successToast("Review deleted successfully");
            refetch(); // Refresh the reviews list
          },
          onError(error: any) {
            errorToast(error?.message || "Error deleting review");
          },
        }
      );
    } catch (error) {
      errorToast("Error deleting review");
    }
  };

  return handleDelete;
};

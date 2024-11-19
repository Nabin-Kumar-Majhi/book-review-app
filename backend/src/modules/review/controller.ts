// controller.ts
import { Request, Response, NextFunction } from "express";
import {
  AddReviewControllerSchema,
  UpdateReviewControllerSchema,
  TReviewCtx,
} from "./validation";
import {
  createReviewService,
  updateReviewService,
  getReviewsByBookIdService,
  deleteReviewService,
} from "./service";

// Define interface for request parameters
interface ReviewParams {
  bookId?: string;
  reviewId?: string;
}

// Add Review Controller
export const addReviewController = async (
  req: Request<ReviewParams>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const input = AddReviewControllerSchema.parse(req.body);
    const bookId = req.params.bookId;

    if (!bookId) {
      res.status(400).json({
        message: "Book ID is required",
        isSuccess: false,
        data: null,
      });
      return;
    }

    const ctx: TReviewCtx = {
      userId: req.user.id,
      bookId,
      role: req.user.role,
    };

    const review = await createReviewService(ctx, {
      ...input,
      username: req.user.username,
    });

    res.status(201).json({
      message: "Review added successfully",
      isSuccess: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

// Update Review Controller
export const updateReviewController = async (
  req: Request<ReviewParams>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const input = UpdateReviewControllerSchema.parse(req.body);
    const reviewId = req.params.reviewId;

    if (!reviewId) {
      res.status(400).json({
        message: "Review ID is required",
        isSuccess: false,
        data: null,
      });
      return;
    }

    const ctx: TReviewCtx = {
      userId: req.user.id,
      bookId: "", // This will be fetched from the review in the service
      role: req.user.role,
    };

    const updatedReview = await updateReviewService(reviewId, ctx, input);

    res.json({
      message: "Review updated successfully",
      isSuccess: true,
      data: updatedReview,
    });
  } catch (error) {
    next(error);
  }
};

// Get Reviews Controller
export const getReviewsByBookIdController = async (
  req: Request<ReviewParams>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const bookId = req.params.bookId;

    if (!bookId) {
      res.status(400).json({
        message: "Book ID is required",
        isSuccess: false,
        data: null,
      });
      return;
    }

    const reviews = await getReviewsByBookIdService(bookId);

    res.json({
      message: "Reviews fetched successfully",
      isSuccess: true,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Review Controller
export const deleteReviewController = async (
  req: Request<ReviewParams>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const reviewId = req.params.reviewId;

    if (!reviewId) {
      res.status(400).json({
        message: "Review ID is required",
        isSuccess: false,
        data: null,
      });
      return;
    }

    const ctx: TReviewCtx = {
      userId: req.user.id,
      bookId: "", // This will be fetched from the review in the service
      role: req.user.role,
    };

    const deletedReview = await deleteReviewService(reviewId, ctx);

    res.json({
      message: "Review deleted successfully",
      isSuccess: true,
      data: deletedReview,
    });
  } catch (error) {
    next(error);
  }
}
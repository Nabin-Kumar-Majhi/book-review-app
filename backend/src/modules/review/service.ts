import mongoose from "mongoose";
import {
  TAddReviewControllerInput,
  TReviewCtx,
  TUpdateReviewControllerInput,
} from "./validation";
import { ReviewModel } from "./model";
import { APIError } from "../../utils/error";

export async function createReviewService(
  ctx: TReviewCtx,
  input: TAddReviewControllerInput & { username: string }
) {
  const { rating, reviewText, username } = input;

  const newReview = new ReviewModel({
    bookId: ctx.bookId,
    userId: ctx.userId,
    username, // Save the username
    rating,
    reviewText,
  });

  await newReview.save();

  return newReview;
}

export async function updateReviewService(
  reviewId: string,
  ctx: TReviewCtx,
  input: TUpdateReviewControllerInput
) {
  // Find the review by ID
  const review = await ReviewModel.findById(reviewId);

  if (!review) {
    throw APIError.notFound("Review not found");
  }

  // Check if the user is the owner - make role check optional
  const isOwner = review.userId?.toString() === ctx.userId;
  const isAdmin = ctx.role === "admin";

  if (!isOwner && !isAdmin) {
    throw APIError.forbidden("You are not authorized to update this review");
  }

  // Destructure the input values
  const { reviewText, rating } = input;

  // Update validation
  if (!reviewText?.trim()) {
    throw APIError.badRequest("Review text is required");
  }

  if (typeof rating !== "number" || rating < 1 || rating > 5) {
    throw APIError.badRequest("Rating must be a number between 1 and 5");
  }

  // Update the review
  const updatedReview = await ReviewModel.findByIdAndUpdate(
    reviewId,
    {
      reviewText,
      rating,
    },
    { new: true }
  );

  if (!updatedReview) {
    throw APIError.notFound("Review not found during update");
  }

  return updatedReview;
}

export async function getReviewsByBookIdService(bookId: string) {
  const reviews = await ReviewModel.find({
    bookId,
  }).select("username rating reviewText created_at"); // Include username in the query

  return reviews;
}

export async function deleteReviewService(reviewId: string, ctx: TReviewCtx) {
  const deleteReview = await ReviewModel.findById(reviewId);

  if (!deleteReview) {
    throw APIError.notFound("Review not found");
  }

  // Check if the user is the owner or an admin
  if (deleteReview.userId?.toString() !== ctx.userId && ctx.role !== "admin") {
    throw APIError.forbidden("You are not authorized to delete this review");
  }

  await ReviewModel.deleteOne({ _id: reviewId });

  return deleteReview;
}

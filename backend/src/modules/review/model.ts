import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  username: { type: String, required: true },
  rating: { type: Number, required: true }, // Changed to Number
  reviewText: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

export const ReviewModel = mongoose.model("Review", reviewSchema);
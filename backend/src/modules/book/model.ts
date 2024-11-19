import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  Title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String, required: true },
  genres: { type: String, required: true },
  image: { type: String}, // Store image path
  created_at: { type: Date, default: Date.now },
});

export const bookModel = mongoose.model("book", bookSchema);

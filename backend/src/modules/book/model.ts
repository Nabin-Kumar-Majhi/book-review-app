import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String},
  genres: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

export const bookModel = mongoose.model("book", bookSchema);



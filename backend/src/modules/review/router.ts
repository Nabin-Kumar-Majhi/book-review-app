import { Router } from "express";
import {
  addReviewController,
  deleteReviewController,
  getReviewsByBookIdController,
  updateReviewController,
} from "./controller";
import { checkAuth } from "../auth/middleware";

function createReviewRouter() {
  const router = Router();

  router.post("/addReview/:bookId", checkAuth, addReviewController);

  router.put("/updateReview/:reviewId", checkAuth, updateReviewController);

  router.get("/getReview/:bookId", checkAuth, getReviewsByBookIdController);

  router.delete("/deleteReview/:reviewId", checkAuth, deleteReviewController);

  return router;
}

export const reviewRouter = createReviewRouter();

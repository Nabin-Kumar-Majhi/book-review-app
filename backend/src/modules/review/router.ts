import { Router } from "express";
import { checkAuth } from "../auth/controller";
import {
  addReviewController,
  getReviewsByBookIdController,
  updateReviewController,
} from "./controller";

function createReviewRouter() {
  const router = Router();
  router.post("/:bookId", checkAuth, addReviewController);
  router.post("/update/:reviewId", checkAuth, updateReviewController);

  router.get("/:bookId", getReviewsByBookIdController);

  return router;
}

export const reviewRouter = createReviewRouter();

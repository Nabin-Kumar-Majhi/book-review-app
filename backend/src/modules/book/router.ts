import { Router } from "express";
import {
  addBookController,
  deleteBookController,
  getAllBookController,
  getBookByIdController,
  updateBookController,
} from "./controller";
import { checkAuth} from "../auth/controller";
import { checkAdmin } from "../auth/middleware";

function createBookRouter() {
  const router = Router();
  router.post("/addbook", checkAuth, checkAdmin, addBookController);
  router.get("/allbook", getAllBookController);
  router.get("/get/:BookId", getBookByIdController);
  router.delete("/delete/:BookId",checkAuth,checkAdmin,deleteBookController);
  router.post("/update/:BookId",checkAuth,checkAdmin,updateBookController);
  return router;
}

export const bookRouter = createBookRouter();

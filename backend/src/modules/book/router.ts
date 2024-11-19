import { Router } from "express";
import {
  addBookController,
  deleteBookController,
  getAllBookController,
  getBookByIdController,
  updateBookController,
} from "./controller";
import { checkAdmin, checkAuth, upload } from "../auth/middleware";

function createBookRouter() {
  const router = Router();

  router.get("/", getAllBookController);
  router.get("/get/:id", getBookByIdController);

  router.post(
    "/addBook",
    checkAuth,
    checkAdmin,
    upload.single("image"), // Multer middleware for file upload
    addBookController
  );

  router.post("/update/:bookId", checkAuth, checkAdmin, updateBookController);

  router.delete("/delete/:bookId", checkAuth, checkAdmin, deleteBookController);

  return router;
}

export const bookRouter = createBookRouter();

import { NextFunction, Request, Response } from "express";
import { APIError } from "../../utils/error";
import { addBookSchema } from "./validation";
import {
  bookService,
  deleteBookServices,
  getAllBookService,
  getBookByIdService,
  updateBookServices,
} from "./service";
import { getReviewsByBookIdService } from "../review/service";

export async function addBookController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    console.log("Request body:", req.body); // Debugging incoming data
    const body = req.body;

    const { success, error, data } = addBookSchema.safeParse(body);

    if (!success) {
      const errors = error.flatten().fieldErrors;
      res.status(400).json({
        message: "Invalid request data",
        isSuccess: false,
        errors: errors,
      });
      return;
    }

    const bookData = await bookService(data);
    res.status(200).json({
      message: "Book added successfully",
      isSuccess: true,
      data: {
        image: bookData.image ,
        id: bookData._id,
        Title: bookData.Title,
        author: bookData.author,
        description: bookData.description,
        genres: bookData.genres,
      },
    });
  } catch (e) {
    if (e instanceof APIError) {
      next(e);
    } else {
      console.error("Error adding book:", e); // Logging the error for debugging
      next(new APIError(500, "Internal Server Error"));
    }
  }
}


export async function getAllBookController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await getAllBookService();
    res.status(200).json({
      message: "all books",
      isSuccess: true,
      data: result,
    });
  } catch (e) {
    if (e instanceof APIError) {
      next(e);
    } else {
      next(new APIError(500, (e as Error).message));
    }
  }
}

export async function getBookByIdController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id;

    if (!id) {
      res.status(400).json({
        message: "id not found",
        data: null,
        isSuccess: false,
      });
      return;
    }

    const result = await getBookByIdService(id);
    const review = await getReviewsByBookIdService(id);

    res.status(200).json({
      message: "book found successfully",
      data: { result, review },
      isSuccess: true,
    });
  } catch (e) {
    if (e instanceof APIError) {
      next(e);
    } else {
      next(new APIError(500, (e as Error).message));
    }
  }
}

export async function updateBookController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const body = req.body;
    const bookId = req.params.bookId;

    const { success, error, data } = addBookSchema.safeParse(body);
    if (!success) {
      const errors = error.flatten().fieldErrors;
      res.status(400).json({
        message: "Invalid request",
        data: null,
        isSuccess: false,
        errors: errors,
      });
      return;
    }
    const book = await updateBookServices(bookId, data);

    res.status(200).json({
      message: "book update successfully",
      isSuccess: true,
      data: book,
    });
  } catch (e) {
    if (e instanceof APIError) {
      next(e);
    } else {
      next(new APIError(500, (e as Error).message));
    }
  }
}

export async function deleteBookController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const bookId = req.params.bookId;

    const book = await deleteBookServices(bookId);

    res.status(200).json({
      message: "book delete successfully",
      isSuccess: true,
      data: book,
    });
  } catch (e) {
    if (e instanceof APIError) {
      next(e);
    } else {
      next(new APIError(500, (e as Error).message));
    }
  }
}

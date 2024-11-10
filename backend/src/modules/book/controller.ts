import { NextFunction, Request, Response } from "express";
import { APIError } from "../../utils/error";
import { addBookSchema, UpdateBookControllerSchema } from "./validation";
import {
  bookService,
  deleteBookService,
  getAllBookService,
  getBookByIdService,
  getBookUpdateService,
} from "./service";
import { log } from "console";

export async function addBookController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const body = req.body;
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

    const bookData = await bookService(data);
    res.status(200).json({
      message: "Book been added successfully",
      isSuccess: true,
      data: {
        id: bookData._id,
        title: bookData.title,
        author: bookData.author,
        description: bookData.description,
        genres: bookData.genres,
      },
    });
  } catch (e) {
    if (e instanceof APIError) {
      next(e);
    } else {
      next(new APIError(500, (e as Error).message));
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
      data: result
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
    const id = req.params.BookId;

    if (!id) {
      res.status(400).json({
        message: "Book ID not provided",
        data: null,
        isSuccess: false,
      });
      return;
    }

    const result = await getBookByIdService(id);
    if (!result) {
      res.status(404).json({
        message: "Book Not Found",
        data: null,
        isSuccess: false,
      });
    } else {
      res.status(200).json({
        message: "Book found successfully",
        data: {
          _id: result._id,
          title: result.title,
          genres: result.genres,
          author: result.author,
          description: result.description,
          created_at: result.created_at,
          __v: result.__v
        },
        isSuccess: true,
      });
    }
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
    const BookId = req.params.BookId;
    console.log("boookid: in controller", BookId);
    const result = await deleteBookService(BookId);

    if (!result) {
      res.status(404).json({
        message: "Book Not Deleted",
        data: null,
        isSuccess: false,
      });
    } else {
      res.status(200).json({
        message: "Book Deleted successfully",
        data: {
          _id: result._id,
          title: result.title,
          genres: result.genres,
          author: result.author,
          description: result.description,
          created_at: result.created_at,
          __v: result.__v
        },
        isSuccess: true,
      });
    }
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
    const bookId = req.params.BookId;

    console.log("at controller", bookId);

    const { success, error, data } = UpdateBookControllerSchema.safeParse(body);
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

    const book = await getBookUpdateService(bookId, data);

    // Define the order of the response data
    res.status(201).json({
      message: "Book updated successfully",
      isSuccess: true,
      data: {
        _id: book._id,
        title: book.title,
        genres: book.genres,
        author: book.author,
        description: book.description,
        created_at: book.created_at,
        __v: book.__v
      }
    });
  } catch (error) {
    if (error instanceof APIError) {
      next(error);
    } else {
      next(new APIError(500, (error as Error).message));
    }
  }
}

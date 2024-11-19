import { error } from "console";
import { APIError } from "../../utils/error";
import { bookModel } from "./model";
import { TaddBookSchema } from "./validation";

export async function bookService(input: TaddBookSchema) {
  const { Title, author, description, genres, image } = input;

  const book = await bookModel.findOne({ Title });
  if (book) {
    throw APIError.conflict("Book already exists");
  }

  const newBook = new bookModel({
    Title,
    author,
    description,
    genres,
    image: image || "/default-book.jpg", // Use a default image if none is provided
  });

  await newBook.save();
  return newBook;
}

export async function getAllBookService() {
  const book = await bookModel.find();
  return book;
}

export async function getBookByIdService(_id: string) {
  const book = await bookModel.findById(_id);
  return book;
}

export async function updateBookServices(
  bookId: string,
  input: TaddBookSchema
) {
  const { Title, author, description, genres, image } = input;
  const book = await bookModel.findById(bookId);
  if (!book) {
    throw APIError.notFound("book does not exist");
  }
  book.Title = Title;
  book.author = author;
  book.description = description;
  book.genres = genres;
  book.image = image;

  // await book.replaceOne({ _id: bookId });
  await book.save();
  return book;
}

export async function deleteBookServices(id: string) {
  const book = await bookModel.findByIdAndDelete(id);
  if (!book) {
    throw APIError.notFound("book not found");
  }
  return book;
}

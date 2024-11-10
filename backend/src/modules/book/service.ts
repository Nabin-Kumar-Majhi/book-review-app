import { error } from "console";
import { APIError } from "../../utils/error";
import { TaddBookSchema, TUpdateBookControllerInput } from "./validation";
import { bookModel } from "./model";

export async function bookService(input: TaddBookSchema) {
  const { title, author, description, genres } = input;
  const book = await bookModel.findOne({ title });
  if (book) {
    throw APIError.conflict("Book already exist");
  }

  const newBook = new bookModel({
    title,
    author,
    description,
    genres,
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

export async function deleteBookService(BookId: string) {
  // console.log("Before",BookId);

  const deletebook = await bookModel.findByIdAndDelete(BookId);

  // console.log("After",book);

  if (!deletebook) {
    throw APIError.notFound("Book Not Exist");
  }
  await bookModel.deleteOne({ _id: BookId });

  return deletebook;
}


export async function getBookUpdateService(
  bookId: string,
  input: TUpdateBookControllerInput
) {
  const { title, genres, author, description } = input;
  // console.log("in service", bookId);

  // Use findByIdAndUpdate with the update fields and { new: true } to return the updated document
  const book = await bookModel.findByIdAndUpdate(
    bookId,
    { title, genres, author, description },
    { new: true } // This returns the updated book
  );

  // console.log("after model_service", book);

  if (!book) {
    throw APIError.notFound("Book not found");
  }

  return book;
}

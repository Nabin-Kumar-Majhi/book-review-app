import { env } from "../../config";

export type TBook = {
  _id: string;
  Title: string;
  author: string;
  genres: string;
  description: string;
  image: string;
  created_at: string;
};

/**
 * for add book api
 */
export type TAddBookInput = {
  Title: string;
  author: string;
  genres: string;
  description: string;
  image?: string;
};

export type TAddBookOutput = {
  book: TBook;
  message: string;
  statusCode: number;
};

export async function addBook(input: TAddBookInput): Promise<TAddBookOutput> {
  const finalImage = input.image || "default-book.jpg"; // Ensure default image is used

  const res = await fetch(`${env.BACKEND_URL}/api/books/addBook`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...input,
      image: finalImage,
    }),
  });
  
  const data = await res.json().catch((err) => console.error('Error parsing JSON:', err));
  
  if (!res.ok) {
    console.error('Failed to fetch:', data);
    throw new Error(data?.message || 'Something went wrong');
  }

  return data;
}


/**
 * for update book api
 */

export type TUpdateBookInput = {
  bookId: string;
  Title: string;
  author: string;
  genres: string;
  description: string;
  image: string;
};

export type TUpdateBookOutput = {
  message: string;
  isSuccess: boolean;
  data: TBook;
};

export async function updateBook(
  input: TUpdateBookInput
): Promise<TUpdateBookOutput> {
  const res = await fetch(
    `${env.BACKEND_URL}/api/books/update/${input.bookId}`,
    {
      method: "Post",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    }
  );

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message);
  }

  return data;
}

/**
 * for delete book api
 */

export type TDeleteBookInput = {
  bookId: string;
};

export type TDeleteBookOutput = {
  message: string;
  isSuccess: boolean;
};

export async function deleteBook(
  input: TDeleteBookInput
): Promise<TDeleteBookOutput> {
  const res = await fetch(
    `${env.BACKEND_URL}/api/books/delete/${input.bookId}`,
    {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message);
  }

  return data;
}

/**
 * for get all books api
 */

export type TGetAllBooksOutput = {
  message: string;
  isSuccess: boolean;
  data: TBook[];
};

export async function getAllBooks(): Promise<TGetAllBooksOutput> {
  const res = await fetch(`${env.BACKEND_URL}/api/books`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message);
  }

  return data;
}

/**
 * for get book by id api
 */

export type TGetBookByIdInput = {
  bookId: string;
};

export type TGetBookByIdOutput = {
  message: string;
  isSuccess: boolean;
  data: TBook;
};

export async function getBookById(
  input: TGetBookByIdInput
): Promise<TGetBookByIdOutput> {
  const res = await fetch(`${env.BACKEND_URL}/api/books/${input.bookId}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message);
  }

  return data;
}
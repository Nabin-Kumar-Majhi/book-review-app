import { z } from "zod";

export const addBookSchema = z.object({
  Title: z.string(),
  author: z.string(),
  description: z.string(),
  genres: z.string(),
  image: z.string().url().optional(), // Ensures `image` is a valid URL
});



export type TaddBookSchema = z.TypeOf<typeof addBookSchema>;

import { z } from "zod";

export const addBookSchema = z.object({
  title: z.string(),
  author: z.string(),
  description: z.string(),
  genres: z.string(),
});
export type TaddBookSchema = z.TypeOf<typeof addBookSchema>;

export const UpdateBookControllerSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  genres: z.string().min(1),
  description: z.string().optional(),
});
export type TUpdateBookControllerInput = z.TypeOf<
  typeof UpdateBookControllerSchema
>;

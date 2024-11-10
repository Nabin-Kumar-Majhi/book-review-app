import { z } from "zod";

export const userRegisterSchema = z.object({
  email: z.string().email(),
  username: z.string(),
  password: z.string().min(6).max(15),
  role: z.enum(["admin", "user"]).default("user"),
});
export type TuserRegisterSchema = z.TypeOf<typeof userRegisterSchema>;

export const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
export type TuserLoginSchema = z.TypeOf<typeof userLoginSchema>;

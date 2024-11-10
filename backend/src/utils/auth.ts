import bcryptjs from "bcryptjs";
import { env } from "./config";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

// hashing password for security
export async function hashPassword(password: string) {
  const hashed = bcryptjs.hash(password, 10);
  return hashed;
}

// comparing password
export async function comparePassword(
  password: string,
  hashedPassword: string
) {
  const isCompared = await bcryptjs.compare(password, hashedPassword);
  return isCompared;
}

export type TTokenPayload = {
  id: string;
  username: string;
  email: string;
  role: string;
};

const secretKey = env.JWT_SECRET;

export function generateToken(payload: TTokenPayload) {
  const token = jwt.sign(payload, secretKey, {
    expiresIn: 60 * 60, // 1 hour
  });
  return token;
}

export function verifyToken(token: string) {
  try {
    const verified = jwt.verify(token, secretKey);
    return {
      message: "token verified",
      isValid: true,
      payload: verified,
    };
  } catch (e) {
    console.log(e);
    if (e instanceof TokenExpiredError) {
      return {
        inValid: false,
        message: e.message,
        payload: null,
      };
    } else if (e instanceof JsonWebTokenError) {
      return {
        inValid: false,
        message: e.message,
        payload: null,
      };
    }
    return {
      inValid: false,
      message: "something went wrong when verifying token",
      payload: null,
    };
  }
}

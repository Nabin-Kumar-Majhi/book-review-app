import cookieParser from "cookie-parser";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { env } from "./utils/config";
import { APIError } from "./utils/error";
import { createDBConnection } from "./utils/db";
import { authRouter } from "./modules/auth/router";
import { bookRouter } from "./modules/book/router";
import { reviewRouter } from "./modules/review/router";

createDBConnection()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });

const app = express();

app.use(
  cors({
    origin: "*", // ACCESS-CONTROL-ALLOW-ORIGIN:http://localhost:5173
    credentials: true, // Access-Control-Allow-Credentials: allow
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({
    message: "welcome to Book review app",
    data: null,
    isSuccess: true,
  });
  return;
});

// authentication routes
app.use("/api/auth", authRouter);

// book router
app.use("/api/books", bookRouter);

//Review Routes
app.use("/api/reviews", reviewRouter);

app.use((error: APIError, req: Request, res: Response, next: NextFunction) => {
  console.log(error);

  if (error instanceof APIError) {
    res.status(error.status).json({
      message: error.message,
      data: null,
      isSuccess: false,
    });
    return;
  }

  res.status(500).json({
    message: "something went wrong on the server",
    data: null,
    isSuccess: false,
  });
});

app.listen(env.PORT, () => {
  console.log(`Searver starting at port ${env.PORT}`);
});

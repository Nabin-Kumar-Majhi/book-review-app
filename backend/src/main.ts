import cookieParser from "cookie-parser";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import path from "path";
import { env } from "./utils/config";
import { APIError } from "./utils/error";
import { createDBConnection } from "./utils/db";
import { authRouter } from "./modules/auth/router";
import { bookRouter } from "./modules/book/router";
import { reviewRouter } from "./modules/review/router";
import { multerErrorHandler } from "./modules/auth/middleware";

// Connect to Database
createDBConnection()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });

const app = express();

// Enable CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173", 
      "https://book-review-app-five.vercel.app"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Middleware for JSON and Cookies
app.use(express.json());
app.use(cookieParser());

// Serve Static Files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Test Route
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({
    message: "Welcome to Book Review App",
    data: null,
    isSuccess: true,
  });
  return;
});

// Authentication Routes
app.use("/api/auth", authRouter);

// Book Routes
app.use("/api/books", bookRouter);

// Review Routes
app.use("/api/reviews", reviewRouter);

// Error Handling Middleware (Including Multer Errors)
app.use(multerErrorHandler); // Global error handler for file uploads

// General Error Handling Middleware
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
    message: "Something went wrong on the server",
    data: null,
    isSuccess: false,
  });
});

// Start Server
app.listen(env.PORT, () => {
  console.log(`Server starting at port ${env.PORT}`);
});

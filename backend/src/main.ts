import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { env } from "./utils/config";
import { APIError } from "./utils/error";
import { createDBConnection } from "./utils/db";


createDBConnection()
.then(() => {
    console.log("Database connected successfully");
})
.catch((error) => {
    console.log("Database connection error:", error);
});

const app = express();

app.use(
    cors({
        origin: "*",
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.json({
        message: "Welcome to Book Review App",
        data: null,
        isSuccess: true,
    });;
})

//Global Error Handler

app.use((error: APIError, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    if (error instanceof APIError) {
        res.status(error.status).json({
            message: error.message,
            data: null,
            isSuccess: false,
        });
        return;
    }
    res.status(500).json({
        message: "Internal server error",
        data: null,
        isSuccess: false,
    });
});

app.listen(env.PORT, () => 
console.log(`Server started on: http://localhost:${env.PORT}`)
);
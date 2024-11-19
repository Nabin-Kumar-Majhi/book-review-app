import { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import { TTokenPayload, verifyToken } from "../../utils/auth";

// ------------------------- TYPE DECLARATIONS -------------------------
declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        username: string;
        email: string;
        role: string;
      };
    }
  }
}

// ------------------------- AUTHENTICATION MIDDLEWARE -------------------------
export async function checkAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  // Ensure the return type is `Promise<void>`
  try {
    const cookies = req.cookies;
    const token = (cookies?.token as string) || "";

    if (!token) {
      res.status(401).json({
        message: "Cookie not found or is invalid. You are not logged in!",
        isSuccess: false,
        data: null,
      });
      return
    }

    const verifyTokenOutput = verifyToken(token);

    if (!verifyTokenOutput.isValid) {
      res.status(401).json({
        message: verifyTokenOutput.message,
        isSuccess: false,
        data: null,
      });
      return
    }

    if (!verifyTokenOutput.payload) {
      res.status(401).json({
        message: "Invalid token",
        isSuccess: false,
        data: null,
      });
      return
    }

    const payload = verifyTokenOutput.payload as TTokenPayload;

    // Set default role if not present
    const userRole = payload.role || "user";

    // Attach user information to request
    req.user = {
      id: payload.id,
      username: payload.username,
      email: payload.email,
      role: userRole,
    };

    next(); // Pass control to the next middleware
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({
      message: "Internal server error during authentication",
      isSuccess: false,
      data: null,
    });
    return
  }
}

// ------------------------- AUTHORIZATION MIDDLEWARE -------------------------
export async function checkAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  // Ensure the return type is `Promise<void>`
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Authentication required",
        isSuccess: false,
        data: null,
      });
      return
    }

    if (req.user.role !== "admin") {
      res.status(401).json({
        message: "Unauthorized: Admin privileges required",
        isSuccess: false,
        data: null,
      });
      return
    }
//SA
    next(); // Pass control to the next middleware
  } catch (error) {
    console.error("Authorization error:", error);
    res.status(500).json({
      message: "Internal server error during authorization",
      isSuccess: false,
      data: null,
    });
    return
  }
}

// ------------------------- CUSTOM MIDDLEWARE TYPES -------------------------
interface MulterError extends Error {
  code: string;
  field?: string;
}

// ------------------------- FILE UPLOAD MIDDLEWARE -------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = process.env.UPLOADS_DIR || "uploads/";
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Add timestamp and random string for uniqueness
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
    );
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB file size limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(new Error("Only .jpeg, .jpg, and .png files are allowed!") as any);
    }
  },
});

// ------------------------- ERROR HANDLING FOR MULTER -------------------------
export const multerErrorHandler = (
  err: MulterError | Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Ensure the return type is `void`
  if (err instanceof multer.MulterError) {
    // Handle specific Multer errors
    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        res.status(400).json({
          message: "File is too large. Maximum size is 5MB",
          isSuccess: false,
          data: null,
        });
        return
      case "LIMIT_UNEXPECTED_FILE":
        res.status(400).json({
          message: "Unexpected field in file upload",
          isSuccess: false,
          data: null,
        });
        return
      default:
        //SA
        res.status(400).json({
          message: err.message,
          isSuccess: false,
          data: null,
        });
        return
    }
  } else if (err) {
    // Handle custom and general errors
    res.status(500).json({
      message: err.message || "An error occurred during file upload",
      isSuccess: false,
      data: null,
    });
    return
  }

  next(); // Ensure next() is called if no error
};

// ------------------------- TYPE GUARD FUNCTIONS -------------------------
export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Ensure the return type is `void`
  if (!req.user) {
    res.status(401).json({
      message: "Authentication required",
      isSuccess: false,
      data: null,
    });
    return
  }
  next(); // Pass control to the next middleware
}

// ------------------------- ROLE-BASED MIDDLEWARE -------------------------
export function checkRole(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Ensure the return type is `void`
    try {
      if (!req.user) {
        res.status(401).json({
          message: "Authentication required",
          isSuccess: false,
          data: null,
        });
        return
      }

      if (!roles.includes(req.user.role)) {
        res.status(403).json({
          message: "Unauthorized: Required role not found",
          isSuccess: false,
          data: null,
        });
        return
      }

      next(); // Pass control to the next middleware
    } catch (error) {
      console.error("Role check error:", error);
      res.status(500).json({
        message: "Internal server error during role check",
        isSuccess: false,
        data: null,
      });
      return
    }
  };
}

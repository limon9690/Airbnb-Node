import { rateLimit } from "express-rate-limit";
import { Request, Response } from "express";

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  limit: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: "draft-7", // Return standard rate limit info in headers
  legacyHeaders: false, // Disable X-RateLimit-* headers
  message: {
    status: 429,
    message:
      "Too many requests from this IP, please try again after 15 minutes.",
  },
  // Type-safe custom handler (optional)
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: "Rate limit exceeded",
      retryAfter: res.getHeader("Retry-After"),
    });
  },
});

// Stricter limiter for sensitive endpoints (e.g., auth, login)
export const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  limit: 5, // Limit each IP to 5 login requests per minute
  message: "Too many login attempts. Please try again in a minute.",
});

import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  forgotPassword,
  login,
  logout,
  me,
  register,
  resetPasswordHandler,
} from "../controllers/authController";
import { requireAuth, requireTenant } from "../middleware/auth";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many attempts. Please try again later.",
  },
});

const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many reset attempts. Please try again later.",
  },
});

router.post("/signup", authLimiter, register);
router.post("/signin", authLimiter, login);
router.post("/logout", logout);
router.get("/me", requireAuth, requireTenant, me);
router.post("/forgot-password", passwordResetLimiter, forgotPassword);
router.post("/reset-password", passwordResetLimiter, resetPasswordHandler);

export default router;

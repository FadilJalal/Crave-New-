import express from 'express';
import { loginUser, registerUser, getProfile, updateProfile } from '../controllers/userController.js';
import authMiddleware from '../middleware/auth.js';
import { validate, registerSchema, loginSchema } from '../utils/validators.js';

const userRouter = express.Router();

userRouter.post("/register", validate(registerSchema), registerUser);
userRouter.post("/login",    validate(loginSchema),    loginUser);
userRouter.get("/profile",   authMiddleware, getProfile);
userRouter.put("/profile",   authMiddleware, updateProfile);

export default userRouter;
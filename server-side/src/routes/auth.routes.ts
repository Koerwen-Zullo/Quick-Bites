import express from "express";
import { registerController, loginController, meController } from "../controllers/auth.controller.ts";
import { authMiddleware } from "../middlewares/auth.middleware.ts";

import { Router } from "express";
const authRouter: Router = express.Router();

authRouter.post("/auth/register", registerController);
authRouter.post("/auth/login", loginController);
authRouter.post("/auth/me", authMiddleware, meController);
export default authRouter


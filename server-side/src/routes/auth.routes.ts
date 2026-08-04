import express from "express";
import { registerController, loginController, meController, roomController, refreshTokenController, logoutController } from "../controllers/auth.controller.ts";
import { authenticate } from "../middlewares/auth.middleware.ts";

import { Router } from "express";
const authRouter: Router = express.Router();

authRouter.post("/auth/register", registerController);
authRouter.post("/auth/login", loginController);
authRouter.get("/auth/me", authenticate, meController);
authRouter.get("/auth/rooms", authenticate, roomController);
authRouter.get("/auth/refresh-token", refreshTokenController);
authRouter.get("/auth/logout", logoutController);
export default authRouter


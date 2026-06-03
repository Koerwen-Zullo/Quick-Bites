import express from "express";
import { registerController } from "../controllers/auth.controller.ts";
import { loginController } from "../controllers/auth.controller.ts";
import { Router } from "express";
const authRouter: Router = express.Router();

authRouter.post("/auth/register", registerController);
authRouter.post("/auth/login", loginController);
export default authRouter


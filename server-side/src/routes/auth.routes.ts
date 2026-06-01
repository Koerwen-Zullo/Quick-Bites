import express from "express";
import { registerController } from "../controllers/auth.controller";

import { Router } from "express";
const authRouter: Router = express.Router();

authRouter.post("/auth/register", registerController);

export default authRouter


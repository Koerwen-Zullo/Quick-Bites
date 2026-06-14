import express from 'express'
import cors from 'cors'
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/error.middleware.ts";
import "dotenv/config";
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use("/api", authRouter);
app.use(errorMiddleware)
export default app
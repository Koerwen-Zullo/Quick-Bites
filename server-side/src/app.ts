import express from 'express'
import cors from 'cors'
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import "dotenv/config";
import { Response, Request } from "express";
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

app.use((req: Request, res: Response, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
export default app
import express from 'express'
import cors from 'cors'
import authRouter from "./routes/auth.routes.ts";
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json());
app.use("/api", authRouter);

export default app
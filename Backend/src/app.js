import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRouter from "./routes/auth.route.js";

const app = express();

app.use(cors({
    origin: "https://authentication-task-projects1.vercel.app",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev")); // HTTP request logger

app.use("/api/auth", authRouter);

export default app;
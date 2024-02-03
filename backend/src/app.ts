import express from 'express';
import {config} from "dotenv";
import morgan from 'morgan'
import appRouter from './routes/index.js';
import cors from "cors";

config()

const app = express();

console.log("process.env.CLIENT_URL")
console.log(process.env.CLIENT_URL)
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}))

app.use(express.json())

app.use(morgan("dev"))

app.use("/api/v1", appRouter);

export default app;

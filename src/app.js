import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { MAX_LIMIT } from "./utils/constants.js";
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
  })
);

app.use(
  express.json({
    limit: MAX_LIMIT
  })
);

app.use(
  express.urlencoded({
    limit: MAX_LIMIT
  })
);

app.use(express.static("Public"));

app.use(cookieParser());





// routed import 
import userRouter from "./routes/user.route.js"

app.use("/user",userRouter);














export default app;

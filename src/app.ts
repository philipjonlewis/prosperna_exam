import express, { Express, Request, Response, RequestHandler } from "express";
const app: Express = express();

var boolParser = require("express-query-boolean");
import cookieParser from "cookie-parser";

import helmet from "helmet";
import cors from "cors";
import nocache from "nocache";
require("dotenv").config();

import userAuthRoutes from "./routes/userAuthRoutes";
import productRoutes from "./routes/productRoutes";

import { databaseConnection } from "./model/dbConnection";
import customErrorMiddleware from "./middleware/custom/customErrorMiddleware";

import morgan from "morgan";
import rateLimit from "express-rate-limit";

app.disable("x-powered-by");
app.set("trust proxy", true);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser(process.env.WALKERS_SHORTBREAD));
app.use(boolParser());
app.use(helmet());
app.use(nocache());

app.set("etag", false);
app.set("trust proxy", 1);

app.use(
  cors({
    // origin: "*",
    origin: process.env.FRONTEND_PORT,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  })
);

databaseConnection();

app.use(function (req, res, next) {
  res.header("Content-Type", "application/json;charset=UTF-8");
  // res.header("Access-Control-Allow-Credentials", "*");
  res.header(
    "Access-Control-Allow-Credentials",
    process.env.FRONTEND_PORT || "*"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  })
);

app.use(morgan("dev"));

app.use("/api_v1/user", userAuthRoutes);
app.use("/api_v1/products", productRoutes);

app.get("*", (req, res) => {
  res.send("Page does not exit");
});

app.use(customErrorMiddleware);

export default app;

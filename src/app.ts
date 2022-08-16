import express, { Express, Request, Response, NextFunction } from "express";
const app: Express = express();

import { config } from "./config";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import nocache from "nocache";

import morgan from "morgan";
import rateLimit from "express-rate-limit";

import publicRoutes from "./routes/publicRoutes";
import userAuthRoutes from "./routes/userAuthRoutes";
import productRoutes from "./routes/productRoutes";

import { databaseConnection } from "./model/dbConnection";
import customErrorMiddleware from "./middleware/custom/customErrorMiddleware";

var boolParser = require("express-query-boolean");
require("dotenv").config();

app.disable("x-powered-by");

app.set("trust proxy", true);
app.set("etag", false);

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser(process.env.WALKERS_SHORTBREAD));
app.use(boolParser());
app.use(helmet());
app.use(nocache());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  })
);

app.use(function (req: Request, res: Response, next: NextFunction) {
  res.header("Content-Type", "application/json;charset=UTF-8");
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

databaseConnection();

// All routes the can be publicly access can be found in the routes below
app.use(`${config.URL}/public`, publicRoutes);

// All User Auth routes can be found in the function below
app.use(`${config.URL}/user`, userAuthRoutes);

// All Product routes can be found in the function below
app.use(`${config.URL}/products`, productRoutes);

app.get("*", (req: Request, res: Response) => {
  // Should send a more formatted response
  res.send("Page does not exit");
});

app.use(customErrorMiddleware);

export default app;

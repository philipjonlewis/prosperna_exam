import modifiedErrorHandler from "./modifiedErrorHandler";
// Also import a custom error model for storing errors

import express, {
  ErrorRequestHandler,
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";

const customErrorMiddleware = async (
  error: ErrorRequestHandler | any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { statusCode, message } = error;
  return (
    res
      // .clearCookie("authentication-refresh", { path: "/" })
      // .clearCookie("authentication-access", { path: "/" })
      .status(statusCode)
      .json({
        statusCode,
        message,
      })
  );
};

export default customErrorMiddleware;

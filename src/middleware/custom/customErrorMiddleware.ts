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
  const { status, message, payload } = error;
  return (
    res
      // .clearCookie("authentication-refresh", { path: "/" })
      // .clearCookie("authentication-access", { path: "/" })
      .status(status)
      .json({
        success: false,
        message,
        payload,
      })
  );
};

export default customErrorMiddleware;

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
  err: ErrorRequestHandler | any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = err;
  return res.status(error.error.code).json(error);
};

export default customErrorMiddleware;

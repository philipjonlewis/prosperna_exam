import { Request, Response, RequestHandler, NextFunction } from "express";
import sanitizeHtml from "sanitize-html";

import asyncHandler from "../../handlers/asyncHandler";
import ErrorHandler from "../custom/modifiedErrorHandler";

const sanitizationOptions = {
  allowedTags: [],
  parser: {
    lowerCaseTags: true,
  },
};

const signUpUserDataSanitizer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, passwordConfirmation } = req.body;

      res.locals.sanitizedSignUpUserData = {
        email: sanitizeHtml(email.toString().trim(), sanitizationOptions),
        password,
        passwordConfirmation,
      };

      delete req.body;

      return next();
    } catch (error: any) {
      throw new ErrorHandler(500, error.message, {});
    }
  }
) as RequestHandler;

const logInUserDataSanitizer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      res.locals.sanitizedLogInUserData = {
        email: sanitizeHtml(email.toString().trim(), sanitizationOptions),
        password,
      };

      delete req.body;

      return next();
    } catch (error: any) {
      throw new ErrorHandler(500, error.message, {});
    }
  }
) as RequestHandler;

export { signUpUserDataSanitizer, logInUserDataSanitizer };

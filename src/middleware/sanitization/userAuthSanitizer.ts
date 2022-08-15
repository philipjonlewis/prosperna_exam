import path from "path";
const scriptName = path.basename(__filename);

import { Request, Response, RequestHandler, NextFunction } from "express";
import sanitizeHtml from "sanitize-html";

import asyncHandler from "../../handlers/asyncHandler";
import ErrorHandler from "../custom/modifiedErrorHandler";

import { userAuthSanitizationError } from "../../helpers/userAuthErrorResponse";

import type {} from "../../types/commonTypes";

import type {
  UserSignupData,
  UserLogInData,
  UpdateUserEmailData,
  UpdateUserPasswordData,
  UserDeleteData,
  TypedUserAuthRequestBody,
  TypedUserAuthSanitizedResponseBody,
} from "../../types/userAuthTypes";

const sanitizationOptions = {
  allowedTags: [],
  parser: {
    lowerCaseTags: true,
  },
};

const signUpUserDataSanitizer = asyncHandler(
  async (
    req: TypedUserAuthRequestBody,
    res: TypedUserAuthSanitizedResponseBody,
    next: NextFunction
  ) => {
    try {
      const { email, password, passwordConfirmation } =
        req.body as UserSignupData;

      res.locals.sanitizedSignUpUserData = {
        email: sanitizeHtml(email.toString().trim(), sanitizationOptions),
        password,
        passwordConfirmation,
      };

      return next();
    } catch (error: any) {
      throw new ErrorHandler(userAuthSanitizationError);
    }
  }
) as RequestHandler;

const logInUserDataSanitizer = asyncHandler(
  async (
    req: TypedUserAuthRequestBody,
    res: TypedUserAuthSanitizedResponseBody,
    next: NextFunction
  ) => {
    try {
      const { email, password } = req.body as UserLogInData;

      res.locals.sanitizedLogInUserData = {
        email: sanitizeHtml(email.toString().trim(), sanitizationOptions),
        password,
      };

      return next();
    } catch (error: any) {
      throw new ErrorHandler(userAuthSanitizationError);
    }
  }
) as RequestHandler;

const updateUserEmailSanitizer = asyncHandler(
  async (
    req: TypedUserAuthRequestBody,
    res: TypedUserAuthSanitizedResponseBody,
    next: NextFunction
  ) => {
    try {
      const { email, newEmail, password } = req.body as UpdateUserEmailData;

      res.locals.sanitizedEditUserEmail = {
        email: sanitizeHtml(email.toString().trim(), sanitizationOptions),
        newEmail: sanitizeHtml(newEmail.toString().trim(), sanitizationOptions),
        password,
      };

      return next();
    } catch (error: any) {
      throw new ErrorHandler(userAuthSanitizationError);
    }
  }
) as RequestHandler;

const updateUserPasswordSanitizer = asyncHandler(
  async (
    req: TypedUserAuthRequestBody,
    res: TypedUserAuthSanitizedResponseBody,
    next: NextFunction
  ) => {
    try {
      const { email, password, newPassword } =
        req.body as UpdateUserPasswordData;

      res.locals.sanitizedEditUserPassword = {
        email: sanitizeHtml(email.toString().trim(), sanitizationOptions),
        password,
        newPassword,
      };

      return next();
    } catch (error: any) {
      throw new ErrorHandler(userAuthSanitizationError);
    }
  }
) as RequestHandler;

const deleteUserDataSanitizer = asyncHandler(
  async (
    req: TypedUserAuthRequestBody,
    res: TypedUserAuthSanitizedResponseBody,
    next: NextFunction
  ) => {
    try {
      const { email, password, passwordConfirmation } =
        req.body as UserDeleteData;

      res.locals.sanitizedDeleteUserData = {
        email: sanitizeHtml(email.toString().trim(), sanitizationOptions),
        password,
        passwordConfirmation,
      };

      return next();
    } catch (error: any) {
      throw new ErrorHandler(userAuthSanitizationError);
    }
  }
) as RequestHandler;

export {
  signUpUserDataSanitizer,
  logInUserDataSanitizer,
  updateUserEmailSanitizer,
  updateUserPasswordSanitizer,
  deleteUserDataSanitizer,
};

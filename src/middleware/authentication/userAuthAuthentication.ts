import path from "path";
const scriptName = path.basename(__filename);

import { Request, Response, RequestHandler, NextFunction } from "express";

import asyncHandler from "../../handlers/asyncHandler";
import ErrorHandler from "../custom/modifiedErrorHandler";
import UserAuth from "../../model/dbModel/userAuthDbModel";

const signUpAuthenticator = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (
        await UserAuth.exists({
          email: res.locals.validatedSignUpUserData.email,
        })
      )
        throw new ErrorHandler(401, "User Signup Authentication Error");

      return next();
    } catch (error: any) {
      throw new ErrorHandler(error.status, error.message, {
        possibleError: error.message,
        errorLocation: scriptName,
      });
    }
    //if email and password exists do not process
  }
) as RequestHandler;

const logInAuthenticator = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (
        await UserAuth.exists({
          email: res.locals.validatedLogInUserData.email,
        })
      ) {
        return next();
      }

      throw new ErrorHandler(401, "User Log In Authentication Error", {});
    } catch (error: any) {
      throw new ErrorHandler(error.status, error.message, {
        possibleError: error.message,
        errorLocation: scriptName,
      });
    }
  }
) as RequestHandler;

const verifyUserAuthenticator = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (
        await UserAuth.exists({
          _id: res.locals.accessTokenAuthenticatedUserId,
        })
      ) {
        res.locals.isUserVerified = true;
        return next();
      }
      throw new ErrorHandler(401, "User Verification Authentication Error", {});
    } catch (error: any) {
      throw new ErrorHandler(error.status, error.message, {
        possibleError: error.message,
        errorLocation: scriptName,
      });
    }
  }
) as RequestHandler;

const userCredentialsAuthenticator = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (
        await UserAuth.exists({
          _id: res.locals.accessTokenAuthenticatedUserId.toString(),
        })
      )
        return next();
      throw new ErrorHandler(401, "User Credentials Authentication Error", {});
    } catch (error: any) {
      throw new ErrorHandler(error.status, error.message, {
        possibleError: error.message,
        errorLocation: scriptName,
      });
    }
  }
) as RequestHandler;

export {
  signUpAuthenticator,
  logInAuthenticator,
  verifyUserAuthenticator,
  userCredentialsAuthenticator,
};

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
        throw new ErrorHandler(500, "SignUp Authentication Error", {});

      return next();
    } catch (error: any) {
      throw new ErrorHandler(error?.status, error?.message, error);
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

      throw new ErrorHandler(500, "LogIn Authentication Error", {});
    } catch (error: any) {
      throw new ErrorHandler(error.status, error?.message, error);
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
      throw new ErrorHandler(500, "Verify User Authentication Error", {});
    } catch (error: any) {
      throw new ErrorHandler(error.status, error?.message, {});
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
      throw new ErrorHandler(500, "User Credentials Authenticator", {});
    } catch (error: any) {
      throw new ErrorHandler(500, error.message, error);
    }
  }
) as RequestHandler;

export {
  signUpAuthenticator,
  logInAuthenticator,
  verifyUserAuthenticator,
  userCredentialsAuthenticator,
};

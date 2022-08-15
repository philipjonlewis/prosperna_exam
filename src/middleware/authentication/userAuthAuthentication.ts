import path from "path";
const scriptName = path.basename(__filename);

import { Request, Response, RequestHandler, NextFunction } from "express";

import asyncHandler from "../../handlers/asyncHandler";
import ErrorHandler from "../custom/modifiedErrorHandler";
import UserAuth from "../../model/dbModel/userAuthDbModel";

import { userAuthenticationError } from "../../helpers/userAuthErrorResponse";

import type { TypedUserAuthValidatedResponseBody } from "../../types/userAuthTypes";
import type { TypedAccessTokenAuthenticatedResponseBody } from "../../types/cookieAuthTypes";

const signUpAuthenticator = asyncHandler(
  async (
    req: Request,
    res: TypedUserAuthValidatedResponseBody,
    next: NextFunction
  ) => {
    try {
      if (
        await UserAuth.exists({
          email: res.locals.validatedSignUpUserData.email,
        })
      )
        throw new Error();
      return next();
    } catch (error: any) {
      throw new ErrorHandler(userAuthenticationError);
    }
    //if email and password exists do not process
  }
) as RequestHandler;

const logInAuthenticator = asyncHandler(
  async (
    req: Request,
    res: TypedUserAuthValidatedResponseBody,
    next: NextFunction
  ) => {
    try {
      if (
        await UserAuth.exists({
          email: res.locals.validatedLogInUserData.email,
        })
      ) {
        return next();
      }

      throw new Error();
    } catch (error: any) {
      throw new ErrorHandler(userAuthenticationError);
    }
  }
) as RequestHandler;

const verifyUserAuthenticator = asyncHandler(
  async (
    req: Request,
    res: TypedAccessTokenAuthenticatedResponseBody,
    next: NextFunction
  ) => {
    try {
      if (
        await UserAuth.exists({
          _id: res.locals.accessTokenAuthenticatedUserId,
        })
      ) {
        res.locals.isUserVerified = true;
        return next();
      }
      throw new Error();
    } catch (error: any) {
      throw new ErrorHandler(userAuthenticationError);
    }
  }
) as RequestHandler;

const userCredentialsAuthenticator = asyncHandler(
  async (
    req: Request,
    res: TypedAccessTokenAuthenticatedResponseBody,
    next: NextFunction
  ) => {
    try {
      if (
        await UserAuth.exists({
          _id: res.locals.accessTokenAuthenticatedUserId.toString(),
        })
      )
        return next();
      throw new Error();
    } catch (error: any) {
      throw new ErrorHandler(userAuthenticationError);
    }
  }
) as RequestHandler;

export {
  signUpAuthenticator,
  logInAuthenticator,
  verifyUserAuthenticator,
  userCredentialsAuthenticator,
};

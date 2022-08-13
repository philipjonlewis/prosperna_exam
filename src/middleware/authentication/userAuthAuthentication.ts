import { Request, Response, RequestHandler, NextFunction } from "express";

import fs from "fs";
import path from "path";

import jwt from "jsonwebtoken";

import asyncHandler from "../../handlers/asyncHandler";
import ErrorHandler from "../custom/modifiedErrorHandler";

import UserAuth from "../../model/dbModel/userAuthDbModel";

// import { AuthModel } from "../authorization/dbModel";

// import type { TypedResponseBody } from "../../types/commonTypes";

// import type {
//   AuthenticatedSignUpDataType,
//   AuthenticatedLogInDataType,
// } from "../../types/authTypes";

const signUpAuthenticator = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { validatedSignUpUserData } = res.locals;

      const doesUserExist = await UserAuth.exists({
        email: validatedSignUpUserData.email,
      });

      if (doesUserExist) {
        throw new ErrorHandler(500, "SignUp Authentication Error", {});
      }

      return next();
    } catch (error: any) {
      throw new ErrorHandler(error.status, error?.message, {});
    }
    //if email and password exists do not process
  }
) as RequestHandler;

export { signUpAuthenticator };

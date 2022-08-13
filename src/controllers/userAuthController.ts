import { Request, Response, RequestHandler, NextFunction } from "express";
import asyncHandler from "../handlers/asyncHandler";
import ErrorHandler from "../middleware/custom/modifiedErrorHandler";

import UserAuth from "../model/dbModel/userAuthDbModel";

import { userAgentCleaner } from "../utils/userAgentCleaner";

import bcrypt from "bcryptjs";

import {
  signedRefreshToken,
  signedAccessToken,
  refreshCookieOptions,
  accessCookieOptions,
  clearAuthCookieOptions,
} from "../utils/cookieOptions";

const signUpUserDataController = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { validatedSignUpUserData, useragent } = res.locals;
      const { email, password, passwordConfirmation } = validatedSignUpUserData;

      const newUser = new UserAuth({
        email,
        password,
        passwordConfirmation,
        userAgent: { ...(await userAgentCleaner(useragent)) },
      });

      const { _id } = newUser;

      const refreshToken = signedRefreshToken(_id.toString(), email);
      const accessToken = signedAccessToken(_id.toString(), email);

      UserAuth.findByIdAndUpdate(_id, {
        refreshToken,
        accessToken,
      });

      delete res.locals.validatedSignUpUserData;
      delete res.locals.useragent;

      await newUser.save();

      return res
        .status(200)
        .cookie("authentication-refresh", refreshToken, refreshCookieOptions)
        .cookie("authentication-access", accessToken, accessCookieOptions)
        .json({
          code: 200,
          status: true,
          message: "Successfully Signed Up",
          payload: {
            _id,
            email,
          },
        });
    } catch (error: any) {
      throw new ErrorHandler(500, error.message, error);
    }
  }
) as RequestHandler;

export { signUpUserDataController };

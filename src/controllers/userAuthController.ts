import path from "path";
const scriptName = path.basename(__filename);

import { Request, Response, RequestHandler, NextFunction } from "express";
import asyncHandler from "../handlers/asyncHandler";
import ErrorHandler from "../middleware/custom/modifiedErrorHandler";

import UserAuth from "../model/dbModel/userAuthDbModel";
import ProductModel from "../model/dbModel/productsDbModel";
import { userAgentCleaner } from "../utils/userAgentCleaner";

import { userControllerError } from "../helpers/userAuthErrorResponse";
import {
  userAuthSignUpSuccessResponse,
  userAuthLogInSuccessResponse,
  userAuthlogOutSuccessResponse,
  userAuthVerifyUserSuccessResponse,
  userAuthUpdateEmailSuccessResponse,
  userAuthUpdatePasswordSuccessResponse,
  userAuthDeleteUserSuccessResponse,
} from "../helpers/userAuthSuccessResponse";

import bcrypt from "bcryptjs";

import {
  signedRefreshToken,
  signedAccessToken,
  refreshCookieOptions,
  accessCookieOptions,
  clearAuthCookieOptions,
} from "../utils/cookieOptions";

import type { TypedUserAuthControllerResponseBody } from "../types/userAuthTypes";

const signUpUserDataController = asyncHandler(
  async (req: Request, res: TypedUserAuthControllerResponseBody) => {
    try {
      const {
        validatedSignUpUserData: { email, password, passwordConfirmation },
        useragent,
      } = res.locals;

      const newUser = new UserAuth({
        email,
        password: password,
        passwordConfirmation: passwordConfirmation,
        ...(useragent && {
          userAgent: [{ ...(await userAgentCleaner(useragent)) }],
        }),
      });

      const { _id } = newUser;

      const refreshToken = await signedRefreshToken(_id.toString(), email);
      const accessToken = await signedAccessToken(_id.toString(), email);

      newUser.refreshToken = refreshToken;
      newUser.accessToken = accessToken;

      newUser.userAgent = [
        { ...newUser.userAgent[0], refreshToken, accessToken },
      ];

      await newUser.save();

      return res
        .status(200)
        .cookie("authentication-refresh", refreshToken, refreshCookieOptions)
        .cookie("authentication-access", accessToken, accessCookieOptions)
        .json(await userAuthSignUpSuccessResponse(_id, email));
    } catch (error: any) {
      process.env.ENVIRONMENT == "development" &&
        console.error("Error In File : ", scriptName);
      throw new ErrorHandler(userControllerError);
    }
  }
) as RequestHandler;

const loginUserDataController = asyncHandler(
  async (req: Request, res: TypedUserAuthControllerResponseBody) => {
    try {
      const { validatedLogInUserData, useragent }: any = res.locals;

      const existingUser = await UserAuth.find({
        email: validatedLogInUserData.email,
      })
        .select("+email +password +passwordConfirmation +userAgent -__v")
        .limit(1);

      const { _id, email, password, passwordConfirmation, userAgent } =
        existingUser[0];

      const isUserValid =
        (await bcrypt.compare(validatedLogInUserData.password, password)) &&
        (await bcrypt.compare(
          validatedLogInUserData.password,
          passwordConfirmation
        ));

      if (!isUserValid) throw new Error();

      const refreshToken = await signedRefreshToken(_id.toString(), email);
      const accessToken = await signedAccessToken(_id.toString(), email);

      await UserAuth.findByIdAndUpdate(_id, {
        refreshTokens: refreshToken,
        accessTokens: accessToken,
        userAgent: [
          ...userAgent,
          {
            ...(await userAgentCleaner(useragent)),
            refreshToken,
            accessToken,
          },
        ],
      });

      return res
        .status(200)
        .cookie("authentication-refresh", refreshToken, refreshCookieOptions)
        .cookie("authentication-access", accessToken, accessCookieOptions)
        .json(await userAuthLogInSuccessResponse(_id, email));
    } catch (error: any) {
      process.env.ENVIRONMENT == "development" &&
        console.error("Error In File : ", scriptName);
      throw new ErrorHandler(userControllerError);
    }
  }
) as RequestHandler;

const logOutUserDataController = asyncHandler(
  async (req: Request, res: TypedUserAuthControllerResponseBody) => {
    try {
      res
        .status(200)
        .clearCookie("authentication-refresh", clearAuthCookieOptions)
        .clearCookie("authentication-access", clearAuthCookieOptions);
      return res.json(userAuthlogOutSuccessResponse);
    } catch (error: any) {
      throw new ErrorHandler(userControllerError);
    }
  }
) as RequestHandler;

const verifyUserDataController = asyncHandler(
  async (req: Request, res: TypedUserAuthControllerResponseBody) => {
    try {
      const { isUserVerified }: any = res.locals;

      if (!isUserVerified) throw new Error();

      return res.status(200).json(userAuthVerifyUserSuccessResponse);
    } catch (error: any) {
      process.env.ENVIRONMENT == "development" &&
        console.error("Error In File : ", scriptName);
      throw new ErrorHandler(userControllerError);
    }
  }
) as RequestHandler;

const updateUserEmailController = asyncHandler(
  async (req: Request, res: TypedUserAuthControllerResponseBody) => {
    try {
      const { validatedEditUserEmail, accessTokenAuthenticatedUserId } =
        await res.locals;

      const existingUser = await UserAuth.find({
        _id: accessTokenAuthenticatedUserId,
        email: validatedEditUserEmail.email,
      })
        .select("+email +password +passwordConfirmation -__v")
        .limit(1);

      const { _id, password, passwordConfirmation } = existingUser[0];

      const isUserValid =
        (await bcrypt.compare(validatedEditUserEmail.password, password)) &&
        (await bcrypt.compare(
          validatedEditUserEmail.password,
          passwordConfirmation
        ));

      if (!isUserValid) throw new Error();

      const refreshToken = await signedRefreshToken(
        _id.toString(),
        validatedEditUserEmail.newEmail
      );
      const accessToken = await signedAccessToken(
        _id.toString(),
        validatedEditUserEmail.newEmail
      );

      await UserAuth.findByIdAndUpdate(
        { _id: accessTokenAuthenticatedUserId },
        {
          email: validatedEditUserEmail.newEmail,
          refreshTokens: refreshToken,
          accessTokens: accessToken,
        }
      );

      return (
        res
          .status(200)
          // .cookie("authentication-refresh", refreshToken, refreshCookieOptions)
          // .cookie("authentication-access", accessToken, accessCookieOptions)
          .clearCookie("authentication-refresh", clearAuthCookieOptions)
          .clearCookie("authentication-access", clearAuthCookieOptions)
          .json(
            await userAuthUpdateEmailSuccessResponse(
              _id,
              validatedEditUserEmail.email,
              validatedEditUserEmail.newEmail
            )
          )
      );
    } catch (error: any) {
      process.env.ENVIRONMENT == "development" &&
        console.error("Error In File : ", scriptName);
      throw new ErrorHandler(userControllerError);
    }
  }
) as RequestHandler;

const updateUserPasswordController = asyncHandler(
  async (req: Request, res: TypedUserAuthControllerResponseBody) => {
    try {
      const { validatedEditUserPassword, accessTokenAuthenticatedUserId } =
        await res.locals;

      const existingUser = await UserAuth.find({
        _id: accessTokenAuthenticatedUserId,
        email: validatedEditUserPassword.email,
      })
        .select("+email +password +passwordConfirmation -__v")
        .limit(1);

      const { _id, email, password, passwordConfirmation } = existingUser[0];

      const isUserValid =
        (await bcrypt.compare(validatedEditUserPassword.password, password)) &&
        (await bcrypt.compare(
          validatedEditUserPassword.password,
          passwordConfirmation
        ));

      if (!isUserValid) throw new Error();

      const refreshToken = await signedRefreshToken(
        _id.toString(),
        validatedEditUserPassword.email
      );

      const accessToken = await signedAccessToken(
        _id.toString(),
        validatedEditUserPassword.email
      );

      const newPassword = await bcrypt.hash(
        validatedEditUserPassword.newPassword,
        10
      );
      const newPasswordConfirmation = await bcrypt.hash(
        validatedEditUserPassword.newPassword,
        10
      );

      await UserAuth.findByIdAndUpdate(
        { _id: accessTokenAuthenticatedUserId },
        {
          password: newPassword,
          passwordConfirmation: newPasswordConfirmation,
          refreshToken: refreshToken,
          accessToken: accessToken,
        }
      );
      // must log out after
      return (
        res
          .status(200)
          // .cookie("authentication-refresh", refreshToken, refreshCookieOptions)
          // .cookie("authentication-access", accessToken, accessCookieOptions)
          .clearCookie("authentication-refresh", clearAuthCookieOptions)
          .clearCookie("authentication-access", clearAuthCookieOptions)
          .json(await userAuthUpdatePasswordSuccessResponse(_id, email))
      );
    } catch (error: any) {
      process.env.ENVIRONMENT == "development" &&
        console.error("Error In File : ", scriptName);
      throw new ErrorHandler(userControllerError);
    }
  }
) as RequestHandler;

const deleteUserDataController = asyncHandler(
  async (req: Request, res: TypedUserAuthControllerResponseBody) => {
    try {
      const { validatedDeleteUserData, accessTokenAuthenticatedUserId }: any =
        res.locals;

      const existingUser = await UserAuth.find({
        _id: accessTokenAuthenticatedUserId,
        email: validatedDeleteUserData.email,
      })
        .select("-email +password +passwordConfirmation -__v")
        .limit(1);

      const { _id, password, passwordConfirmation } = existingUser[0];

      const isUserValid =
        (await bcrypt.compare(validatedDeleteUserData.password, password)) &&
        (await bcrypt.compare(
          validatedDeleteUserData.password,
          passwordConfirmation
        ));

      if (!isUserValid) throw new Error();

      await ProductModel.deleteMany({ product_owner: _id });
      await UserAuth.findByIdAndDelete(_id);

      return res
        .status(200)
        .clearCookie("authentication-refresh", clearAuthCookieOptions)
        .clearCookie("authentication-access", clearAuthCookieOptions)
        .json(userAuthDeleteUserSuccessResponse);
    } catch (error: any) {
      process.env.ENVIRONMENT == "development" &&
        console.error("Error In File : ", scriptName);
      throw new ErrorHandler(userControllerError);
    }
  }
) as RequestHandler;

export {
  signUpUserDataController,
  loginUserDataController,
  logOutUserDataController,
  verifyUserDataController,
  updateUserEmailController,
  updateUserPasswordController,
  deleteUserDataController,
};

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

const loginUserDataController = asyncHandler(
  async (req: Request, res: Response) => {
    const { validatedLogInUserData }: any = res.locals;

    const existingUser = await UserAuth.find({
      email: validatedLogInUserData.email,
    })
      .select("+email +password +passwordConfirmation -__v")
      .limit(1);

    const { _id, email, password, passwordConfirmation } = existingUser[0];

    const isUserValid =
      (await bcrypt.compare(validatedLogInUserData.password, password)) &&
      (await bcrypt.compare(
        validatedLogInUserData.password,
        passwordConfirmation
      ));

    if (!isUserValid) throw new ErrorHandler(401, "Try Logging in again", {});

    const refreshToken = await signedRefreshToken(_id.toString(), email);
    const accessToken = await signedAccessToken(_id.toString(), email);

    await UserAuth.findByIdAndUpdate(_id, {
      refreshTokens: refreshToken,
      accessTokens: accessToken,
    });

    delete res.locals.validatedLogInUserData;

    return res
      .cookie("authentication-refresh", refreshToken, refreshCookieOptions)
      .cookie("authentication-access", accessToken, accessCookieOptions)
      .json({
        code: 200,
        status: true,
        message: "Successfully logged in",
        payload: {
          _id,
          email,
        },
      });
  }
) as RequestHandler;

const logOutUserDataController = asyncHandler(
  async (req: Request, res: Response) => {
    res
      .clearCookie("authentication-refresh", clearAuthCookieOptions)
      .clearCookie("authentication-access", clearAuthCookieOptions);
    return res.json({
      message: "Logged Out",
    });
  }
) as RequestHandler;

const verifyUserDataController = asyncHandler(
  async (req: Request, res: Response) => {
    const { isUserVerified }: any = res.locals;

    if (!isUserVerified)
      throw new ErrorHandler(401, "Try Logging in again", {});

    return res.status(200).json({
      code: 200,
      status: true,
      message: "User is still logged in",
      payload: {},
    });
  }
) as RequestHandler;

const updateUserEmailController = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { validatedEditUserEmail, refreshTokenAuthenticatedUserId } =
        await res.locals;

      // Must use userId for params and have a setting for existing password to new password
      // const { email, newEmail, password } = validatedEditUserEmail;

      const existingUser = await UserAuth.find({
        _id: refreshTokenAuthenticatedUserId,
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

      if (!isUserValid) throw new ErrorHandler(401, "Try Logging in again", {});

      const refreshToken = await signedRefreshToken(
        _id.toString(),
        validatedEditUserEmail.newEmail
      );
      const accessToken = await signedAccessToken(
        _id.toString(),
        validatedEditUserEmail.newEmail
      );

      await UserAuth.findOneAndUpdate(_id, {
        email: validatedEditUserEmail.newEmail,
        refreshTokens: refreshToken,
        accessTokens: accessToken,
      });

      delete res.locals.validatedEditUserEmail;

      return res
        .cookie("authentication-refresh", refreshToken, refreshCookieOptions)
        .cookie("authentication-access", accessToken, accessCookieOptions)
        .json({
          code: 200,
          status: true,
          message: "Successfully changed email",
          payload: {
            _id,
            oldEmail: validatedEditUserEmail.email,
            email: validatedEditUserEmail.newEmail,
          },
        });
    } catch (error: any) {
      throw new ErrorHandler(500, error.message, error);
    }
  }
) as RequestHandler;

const updateUserPasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { validatedEditUserPassword, refreshTokenAuthenticatedUserId } =
        await res.locals;

      // Must use userId for params and have a setting for existing password to new password
      // const { email, newEmail, password } = validatedEditUserEmail;

      const existingUser = await UserAuth.find({
        _id: refreshTokenAuthenticatedUserId,
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

      if (!isUserValid) throw new ErrorHandler(401, "Try Logging in again", {});

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

      await UserAuth.findOneAndUpdate(_id, {
        password: newPassword,
        passwordConfirmation: newPasswordConfirmation,
        refreshToken: refreshToken,
        accessToken: accessToken,
      });

      delete res.locals.validatedEditUserEmail;

      return res
        .cookie("authentication-refresh", refreshToken, refreshCookieOptions)
        .cookie("authentication-access", accessToken, accessCookieOptions)
        .json({
          code: 200,
          status: true,
          message: "Successfully changed password",
          payload: {
            _id,
            email,
          },
        });
    } catch (error: any) {
      throw new ErrorHandler(500, error?.message, error);
    }
  }
) as RequestHandler;

const deleteUserDataController = asyncHandler(
  async (req: Request, res: Response) => {
    const { validatedDeleteUserData }: any = res.locals;

    const existingUser = await UserAuth.find({
      email: validatedDeleteUserData.email,
    })
      .select("+email +password +passwordConfirmation -__v")
      .limit(1);



    const { _id, email, password, passwordConfirmation } = existingUser[0];

    const isUserValid =
      (await bcrypt.compare(validatedDeleteUserData.password, password)) &&
      (await bcrypt.compare(
        validatedDeleteUserData.password,
        passwordConfirmation
      ));

    if (!isUserValid) throw new ErrorHandler(401, "Try Logging in again", {});

    await UserAuth.findByIdAndDelete(_id);

    delete res.locals.validatedDeleteUserData;

    return res
      .clearCookie("authentication-refresh", clearAuthCookieOptions)
      .clearCookie("authentication-access", clearAuthCookieOptions)
      .json({
        code: 200,
        status: true,
        message: "Deleted User",
        payload: {},
      });
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

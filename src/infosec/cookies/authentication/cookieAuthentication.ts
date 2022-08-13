import fs from "fs";
import path from "path";

import jwt from "jsonwebtoken";

import { Request, Response, RequestHandler, NextFunction } from "express";

import asyncHandler from "../../../handlers/asyncHandler";
import ErrorHandler from "../../../middleware/custom/modifiedErrorHandler";
import UserAuth from "../../../model/dbModel/userAuthDbModel";

const refreshCookieAuthentication = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshCookie = await req.signedCookies["authentication-refresh"];

      const jwtVerificationResults = jwt.verify(
        refreshCookie,
        process.env.AUTH_TOKEN_KEY as string
      ) as any;

      if (jwtVerificationResults) {
        res.locals.refreshTokenAuthenticatedUserId =
          jwtVerificationResults.token;
        return next();
      }

      throw new ErrorHandler(500, "wrong credentials log in again", {});
    } catch (error: any) {
      throw new ErrorHandler(
        error.status,
        "Refresh cookie auth error",
        error.payload
      );
    }
  }
) as RequestHandler;

const accessCookieAuthentication = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshTokenAuthenticatedUserId } = res.locals;
      const accessCookie = await req.signedCookies["authentication-access"];

      jwt.verify(
        accessCookie,
        process.env.AUTH_TOKEN_KEY as string,
        async function (err: any, decoded: any) {
          if (err) {
            if (err.name == "TokenExpiredError") {
              const newAccessToken = jwt.sign(
                { token: refreshTokenAuthenticatedUserId },
                process.env.AUTH_TOKEN_KEY as string,
                {
                  issuer: refreshTokenAuthenticatedUserId,
                  subject: refreshTokenAuthenticatedUserId,
                  audience: "/",
                  expiresIn: "24h",
                  algorithm: "HS256",
                }
              );

              const updatedUser = (await UserAuth.findOneAndUpdate(
                {
                  _id: refreshTokenAuthenticatedUserId,
                },
                { accessTokens: [newAccessToken] }
              )) as any;

              res.locals.accessTokenAuthenticatedUserId =
                updatedUser._id.toString();

              return next();
            } else {
              throw new ErrorHandler(500, "Access cookie auth error", {});
            }
          }

          if (decoded) {
            res.locals.accessTokenAuthenticatedUserId =
              await refreshTokenAuthenticatedUserId;
            return next();
          } else {
            throw new ErrorHandler(500, "Access cookie auth error", {});
          }
        }
      ) as any;
    } catch (error: any) {
      throw new ErrorHandler(error.status, error.mesage, error.payload);
    }
  }
) as RequestHandler;

//  Access Token - if refresh token is ok then renew access token

export { refreshCookieAuthentication, accessCookieAuthentication };

import fs from "fs";
import path from "path";
const scriptName = path.basename(__filename);

import jwt from "jsonwebtoken";

import { Request, Response, RequestHandler, NextFunction } from "express";

import asyncHandler from "../../../handlers/asyncHandler";
import ErrorHandler from "../../../middleware/custom/modifiedErrorHandler";
import { cookieAuthenticationError } from "../../../helpers/cookieErrorResponse";

import UserAuth from "../../../model/dbModel/userAuthDbModel";

const refreshCookieAuthentication = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshCookie = await req.signedCookies["authentication-refresh"];

      const { token } = jwt.verify(
        refreshCookie,
        process.env.AUTH_TOKEN_KEY as string
      ) as any;

      if (token) {
        res.locals.refreshTokenAuthenticatedUserId = await token;
        return next();
      }
    } catch (error: any) {
      throw new ErrorHandler(cookieAuthenticationError);
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
              throw new Error();
            }
          }

          if (decoded) {
            res.locals.accessTokenAuthenticatedUserId =
              await refreshTokenAuthenticatedUserId;
            return next();
          }

          throw new Error();
        }
      ) as any;
    } catch (error: any) {
      throw new ErrorHandler(cookieAuthenticationError);
    }
  }
) as RequestHandler;

//  Access Token - if refresh token is ok then renew access token

export { refreshCookieAuthentication, accessCookieAuthentication };

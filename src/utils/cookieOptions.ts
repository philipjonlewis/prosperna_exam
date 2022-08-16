import jwt from "jsonwebtoken";
import type { CookieOptions } from "express";
import { config } from "../config";

export const signedRefreshToken = async (_id: string, email: string) => {
  return jwt.sign({ token: _id }, process.env.AUTH_TOKEN_KEY as string, {
    issuer: _id,
    subject: email,
    audience: "/",
    expiresIn: "672h",
    algorithm: "HS256",
  });
};

export const signedAccessToken = async (_id: string, email: string) => {
  return jwt.sign({ token: _id }, process.env.AUTH_TOKEN_KEY as string, {
    issuer: _id,
    subject: email,
    audience: "/",
    expiresIn: "24h",
    algorithm: "HS256",
  });
};

export const refreshCookieOptions: CookieOptions = {
  signed: true,
  // expires in 28 days
  // expires: new Date(Date.now() + 6048000 * 4),
  maxAge: 241920000,
  // make secure true upon deployment
  secure: config.environment === "production" ? true : false,
  httpOnly: false,
  sameSite: config.environment === "production" ? "none" : false,
};

export const accessCookieOptions: CookieOptions = {
  signed: true,
  // expires in 28 days
  maxAge: 86400000,
  // make secure true upon deployment
  secure: config.environment === "production" ? true : false,
  httpOnly: false,
  sameSite: config.environment === "production" ? "none" : false,
};

export const clearAuthCookieOptions = {
  //  enable domain on deployment
  domain:
    config.environment === "production"
      ? "https://taptaptask-backend.herokuapp.com"
      : "",
  path: "/",
};

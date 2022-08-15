import { Request, Response, NextFunction, response } from "express";

export interface TypedAccessTokenAuthenticatedResponseBody extends Response {
  locals: {
    accessTokenAuthenticatedUserId: string;
    isUserVerified: boolean;
  };
  // json({ code: number, status: boolean, message: string, payload: Y });
}

import { Request, Response, NextFunction, response } from "express";

export interface TypedPublicAllUsersRequestBody<T = {}> extends Request {
  body: T;
}

export interface TypedPublicAllUsersResponseBody<T = {}> extends Response {
  locals: {
    query: {
      count?: number;
      skip?: number;
    };
  };
}

export interface TypedPublicAllProductsRequestBody<T = {}> extends Request {
  body: T;
}

export interface TypedPublicAllProductsResponseBody extends Response {
  locals: {
    query: {
      count?: number;
      skip?: number;
    };
  };
}

export interface GetAllProducts {
  product_owner: { email: string };
  product_name: string;
  product_description: string;
  product_price: number;
  product_tag: string[];
}

export interface GetAllUsers {
  email: string;
}

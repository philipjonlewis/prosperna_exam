import { Request, Response, NextFunction, response } from "express";
import { IdType } from "./commonTypes";

export interface ProductCreateData {
  product_name: string;
  product_description: string;
  product_price: number;
  product_tag: string[];
}
export interface ProductData {
  _id: IdType;
  product_owner: string;
  product_name: string;
  product_description: string;
  product_price: number;
  product_tag: string[];
}

export interface ProductEditData {
  _id: IdType;
  product_owner: string;
  product_name?: string;
  product_description?: string;
  product_price?: number;
  product_tag?: string[];
}

export interface ProductDeleteData {
  _id: IdType;
  product_owner: string;
}

export interface TypedProductRequestBody<T = {}> extends Request {
  body: T;
}

export interface TypedProductSanitizedResponseBody extends Response {
  locals: {
    sanitizedAddProductData: ProductCreateData;
    sanitizedEditProductData: ProductEditData;
    sanitizedDeleteProductData: ProductDeleteData;
  };
  // json({ code: number, status: boolean, message: string, payload: Y });
}

export interface TypedProductValidatedResponseBody extends Response {
  locals: {
    sanitizedAddProductData?: ProductCreateData;
    validatedAddProductData: ProductCreateData;

    sanitizedEditProductData?: ProductEditData;
    validatedEditProductData: ProductEditData;

    sanitizedDeleteProductData?: ProductDeleteData;
    validatedDeleteProductData: ProductDeleteData;
  };
  // json({ code: number, status: boolean, message: string, payload: Y });
}

export interface TypedProductAuthorizedResponseBody extends Response {
  locals: {
    accessTokenAuthenticatedUserId: string;

    authorizedAddProductData: ProductCreateData<{ product_owner: string }>;
    validatedAddProductData?: ProductCreateData;

    authorizedEditProductData: ProductEditData<{
      product_owner: string;
      _id: string;
    }>;
    validatedEditProductData?: ProductEditData<{ product_owner: string }>;

    authorizedDeleteProductData: ProductDeleteData;
    validatedDeleteProductData?: ProductDeleteData<{ product_owner: string }>;
  };
  // json({ code: number, status: boolean, message: string, payload: Y });
}

export interface TypedProductControllerResponseBody extends Response {
  locals: {
    accessTokenAuthenticatedUserId: string;

    authorizedAddProductData: ProductCreateData<{ product_owner: string }>;

    authorizedEditProductData: ProductEditData<{
      product_owner: string;
      _id: string;
    }>;

    authorizedDeleteProductData: ProductDeleteData;
  };
}

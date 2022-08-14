import path from "path";
const scriptName = path.basename(__filename);

import express, {
  Express,
  Request,
  Response,
  RequestHandler,
  NextFunction,
} from "express";

import ProductModel from "../../model/dbModel/productsDbModel";
import UserAuth from "../../model/dbModel/userAuthDbModel";

import asyncHandler from "../../handlers/asyncHandler";

import ErrorHandler from "../custom/modifiedErrorHandler";

const addProductDataAuthorization = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { accessTokenAuthenticatedUserId, validatedAddProductData } =
        res.locals;

      // Check if user is authorized to add product - user_type merchant
      // Query user if user is merchant
      // If merchant then allow, if not then no.

      res.locals.authorizedAddProductData = {
        product_owner: accessTokenAuthenticatedUserId,
        ...validatedAddProductData,
      };

      delete res.locals.validatedAddProductData;

      return next();
    } catch (error: any) {
      throw new ErrorHandler(422, "Add Product Authorization Error", {
        possibleError: error.message,
        errorLocation: scriptName,
        ...(error.payload && { errorContent: error.payload }),
      });
    }
  }
) as RequestHandler;

const editProductDataAuthorization = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { accessTokenAuthenticatedUserId, validatedEditProductData } =
        res.locals;

      const isUserTheOwner =
        accessTokenAuthenticatedUserId ==
        validatedEditProductData.product_owner;

      const doesProductExist = await ProductModel.exists({
        _id: validatedEditProductData._id,
        product_owner: validatedEditProductData.product_owner,
      });

      if (isUserTheOwner && doesProductExist) {
        res.locals.authorizedEditProductData = validatedEditProductData;
        delete res.locals.validatedEditProductData;
        return next();
      }

      throw new ErrorHandler(422, "Unauthorized access!!");

    } catch (error: any) {
      throw new ErrorHandler(422, "Add Product Authorization Error", {
        possibleError: error.message,
        errorLocation: scriptName,
        ...(error.payload && { errorContent: error.payload }),
      });
    }
  }
) as RequestHandler;

const deleteProductDataAuthorization = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { accessTokenAuthenticatedUserId, validatedDeleteProductData } =
        res.locals;

      const isUserTheOwner =
        accessTokenAuthenticatedUserId ==
        validatedDeleteProductData.product_owner;

      const doesProductExist = await ProductModel.exists({
        _id: validatedDeleteProductData._id,
        product_owner: validatedDeleteProductData.product_owner,
      });

      if (isUserTheOwner && doesProductExist) {
        res.locals.authorizedDeleteProductData = validatedDeleteProductData;
        delete res.locals.validatedDeleteProductData;
        return next();
      }

      throw new ErrorHandler(422, "Unauthorized access!!");

   
    } catch (error: any) {
      throw new ErrorHandler(422, "Delete Product Authorization Error", {
        possibleError: error.message,
        errorLocation: scriptName,
        ...(error.payload && { errorContent: error.payload }),
      });
    }
  }
) as RequestHandler;

export {
  addProductDataAuthorization,
  editProductDataAuthorization,
  deleteProductDataAuthorization,
};

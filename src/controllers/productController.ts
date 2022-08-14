import path from "path";
const scriptName = path.basename(__filename);

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

import ProductModel from "../model/dbModel/productsDbModel";

const addProductDataController = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { authorizedAddProductData } = res.locals;

      const newProduct = new ProductModel(authorizedAddProductData);
      newProduct.save();
      return res.json(newProduct);
    } catch (error: any) {
      throw new ErrorHandler(error.status, "User Log Out Controller Error", {
        possibleError: error.message,
        errorLocation: scriptName,
      });
    }
  }
) as RequestHandler;

const getProductDataController = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { productId } = req.query;
      const { accessTokenAuthenticatedUserId } = res.locals;

      const foundProduct = await ProductModel.find({
        ...(productId && { _id: productId }),
        product_owner: accessTokenAuthenticatedUserId,
      });

      res.send(foundProduct);
    } catch (error: any) {
      throw new ErrorHandler(error.status, "User Log Out Controller Error", {
        possibleError: error.message,
        errorLocation: scriptName,
      });
    }
  }
) as RequestHandler;

const editProductDataController = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { authorizedEditProductData, accessTokenAuthenticatedUserId } =
        res.locals;

      const editedProductData = await ProductModel.findOneAndUpdate(
        {
          _id: authorizedEditProductData._id,
          product_owner: accessTokenAuthenticatedUserId,
        },
        { ...authorizedEditProductData },
        { new: true }
      );

      return res.json(editedProductData);

      // const newProduct = new ProductModel(authorizedEditProductData);
      // newProduct.save();
      // return res.json(newProduct);
    } catch (error: any) {
      throw new ErrorHandler(
        error.status,
        "Edit Product Data Controller Error",
        {
          possibleError: error.message,
          errorLocation: scriptName,
        }
      );
    }
  }
) as RequestHandler;

const deleteProductDataController = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { deleteAllProducts } = req.query;

      // return res.json(req.query);
      const { authorizedDeleteProductData, accessTokenAuthenticatedUserId } =
        res.locals;

      let deletedProductData;

      if (deleteAllProducts) {
        deletedProductData = await ProductModel.deleteMany({
          ...(!deleteAllProducts && { _id: authorizedDeleteProductData._id }),
          product_owner: accessTokenAuthenticatedUserId,
        });
      } else {
        deletedProductData = await ProductModel.deleteOne({
          _id: authorizedDeleteProductData._id,
          product_owner: accessTokenAuthenticatedUserId,
        });
      }

      return res.json(deletedProductData);

      // const newProduct = new ProductModel(authorizedEditProductData);
      // newProduct.save();
      // return res.json(newProduct);
    } catch (error: any) {
      throw new ErrorHandler(
        error.status,
        "Delete Product Data Controller Error",
        {
          possibleError: error.message,
          errorLocation: scriptName,
        }
      );
    }
  }
) as RequestHandler;

export {
  addProductDataController,
  getProductDataController,
  editProductDataController,
  deleteProductDataController,
};

import path from "path";
const scriptName = path.basename(__filename);

import { Request, Response, RequestHandler, NextFunction } from "express";
import asyncHandler from "../handlers/asyncHandler";
import ErrorHandler from "../middleware/custom/modifiedErrorHandler";
import { productControllerError } from "../helpers/productErrorResponse";

import ProductModel from "../model/dbModel/productsDbModel";
import type {
  TypedProductControllerResponseBody,
  ProductData,
  ProductEditData,
  ProductDeleteData,
} from "../types/productTypes";
import {
  productCreateSuccessResponse,
  productReadSuccessResponse,
  productEditSuccessResponse,
  productDeleteSuccessResponse,
} from "../helpers/productSuccessResponse";

const addProductDataController = asyncHandler(
  async (req: Request, res: TypedProductControllerResponseBody) => {
    try {
      const { authorizedAddProductData } = res.locals;

      const newProduct = new ProductModel(authorizedAddProductData);
      newProduct.save();
      const {
        _id,
        product_name,
        product_description,
        product_price,
        product_tag,
      } = newProduct;

      return res
        .status(201)
        .json(
          await productCreateSuccessResponse(
            _id,
            product_name,
            product_description,
            product_price,
            product_tag
          )
        );
    } catch (error: any) {
      process.env.ENVIRONMENT == "development" &&
        console.error("Error In File : ", scriptName);
      throw new ErrorHandler(productControllerError);
    }
  }
) as RequestHandler;

const getProductDataController = asyncHandler(
  async (req: Request, res: TypedProductControllerResponseBody) => {
    try {
      const { productId } = req.query;
      const { accessTokenAuthenticatedUserId } = res.locals;

      const products = (await ProductModel.find({
        ...(productId && { _id: productId }),
        product_owner: accessTokenAuthenticatedUserId,
      })) as ProductData[];

      return res.status(201).json(await productReadSuccessResponse(products));
    } catch (error: any) {
      process.env.ENVIRONMENT == "development" &&
        console.error("Error In File : ", scriptName);
      throw new ErrorHandler(productControllerError);
    }
  }
) as RequestHandler;

const editProductDataController = asyncHandler(
  async (req: Request, res: TypedProductControllerResponseBody) => {
    try {
      const { authorizedEditProductData, accessTokenAuthenticatedUserId } =
        res.locals;

      const editedProductData = (await ProductModel.findOneAndUpdate(
        {
          _id: authorizedEditProductData._id,
          product_owner: accessTokenAuthenticatedUserId,
        },
        { ...authorizedEditProductData },
        { new: true }
      )) as ProductEditData;

      return res
        .status(200)
        .json(await productEditSuccessResponse(editedProductData));
    } catch (error: any) {
      process.env.ENVIRONMENT == "development" &&
        console.error("Error In File : ", scriptName);
      throw new ErrorHandler(productControllerError);
    }
  }
) as RequestHandler;

const deleteProductDataController = asyncHandler(
  async (req: Request, res: TypedProductControllerResponseBody) => {
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

      return res
        .status(200)
        .json(await productDeleteSuccessResponse(deletedProductData));
    } catch (error: any) {
      process.env.ENVIRONMENT == "development" &&
        console.error("Error In File : ", scriptName);
      throw new ErrorHandler(productControllerError);
    }
  }
) as RequestHandler;

export {
  addProductDataController,
  getProductDataController,
  editProductDataController,
  deleteProductDataController,
};

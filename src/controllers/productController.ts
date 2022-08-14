import path from "path";
const scriptName = path.basename(__filename);

import { Request, Response, RequestHandler, NextFunction } from "express";
import asyncHandler from "../handlers/asyncHandler";
import ErrorHandler from "../middleware/custom/modifiedErrorHandler";
import { productControllerError } from "../helpers/productErrorResponse";

import ProductModel from "../model/dbModel/productsDbModel";

const addProductDataController = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { authorizedAddProductData } = res.locals;

      const newProduct = new ProductModel(authorizedAddProductData);
      newProduct.save();

      return res.status(201).json({
        success: true,
        message: "Successfully added a product",
        payload: {
          _id: newProduct._id,
          product_name: newProduct.product_name,
          product_description: newProduct.product_description,
          product_price: newProduct.product_price,
        },
      });
    } catch (error: any) {
      throw new ErrorHandler(productControllerError);
    }
  }
) as RequestHandler;

const getProductDataController = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { productId } = req.query;
      const { accessTokenAuthenticatedUserId } = res.locals;

      const products = await ProductModel.find({
        ...(productId && { _id: productId }),
        product_owner: accessTokenAuthenticatedUserId,
      }).select("-__v -product_owner +_id +product_tag");

      return res.status(201).json({
        success: true,
        message: "Successfully reading products",
        productCount: products.length,
        payload: products,
      });
    } catch (error: any) {
      throw new ErrorHandler(productControllerError);
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
      ).select("-__v +product_tag");

      return res.status(200).json({
        success: true,
        message: "Successfully edited product",
        payload: editedProductData,
      });
    } catch (error: any) {
      throw new ErrorHandler(productControllerError);
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

      return res.status(200).json({
        success: true,
        message: "Successfully deleted a product",
        payload: deletedProductData,
      });

      // const newProduct = new ProductModel(authorizedEditProductData);
      // newProduct.save();
      // return res.json(newProduct);
    } catch (error: any) {
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

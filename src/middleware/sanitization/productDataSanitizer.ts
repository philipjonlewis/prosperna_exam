import path from "path";
const scriptName = path.basename(__filename);

import { Request, Response, RequestHandler, NextFunction } from "express";
import sanitizeHtml from "sanitize-html";

import asyncHandler from "../../handlers/asyncHandler";
import ErrorHandler from "../custom/modifiedErrorHandler";

import { productSanitizationError } from "../../helpers/productErrorResponse";

const sanitizationOptions = {
  allowedTags: [],
  parser: {
    lowerCaseTags: true,
  },
};

import type {
  TypedProductRequestBody,
  TypedProductSanitizedResponseBody,
  ProductCreateData,
  ProductEditData,
  ProductDeleteData,
} from "../../types/productTypes";

const addProductDataSanitizer = asyncHandler(
  async (
    req: TypedProductRequestBody<ProductCreateData>,
    res: TypedProductSanitizedResponseBody,
    next: NextFunction
  ) => {
    try {
      const { product_name, product_description, product_price, product_tag } =
        req.body;

      res.locals.sanitizedAddProductData = {
        product_name: sanitizeHtml(
          product_name.toString().trim(),
          sanitizationOptions
        ),
        product_description: sanitizeHtml(
          product_description.toString().trim(),
          sanitizationOptions
        ),
        product_price: Number(
          sanitizeHtml(product_price.toString().trim(), sanitizationOptions)
        ),
        product_tag: product_tag.map((tag: string) => {
          return sanitizeHtml(tag.toString().trim(), sanitizationOptions);
        }),
      };

      return next();
    } catch (error: any) {
      throw new ErrorHandler(productSanitizationError);
    }
  }
) as RequestHandler;

const editProductDataSanitizer = asyncHandler(
  async (
    req: TypedProductRequestBody<ProductEditData>,
    res: TypedProductSanitizedResponseBody,
    next: NextFunction
  ) => {
    try {
      const {
        _id,
        product_owner,
        product_name,
        product_description,
        product_price,
        product_tag,
      } = req.body;

      res.locals.sanitizedEditProductData = {
        _id: sanitizeHtml(_id.toString().trim(), sanitizationOptions),
        product_owner: sanitizeHtml(
          product_owner.toString().trim(),
          sanitizationOptions
        ),
        ...(product_name && {
          product_name: sanitizeHtml(
            product_name.toString().trim(),
            sanitizationOptions
          ),
        }),
        ...(product_description && {
          product_description: sanitizeHtml(
            product_description.toString().trim(),
            sanitizationOptions
          ),
        }),
        ...(product_price && {
          product_price: Number(
            sanitizeHtml(product_price.toString().trim(), sanitizationOptions)
          ),
        }),
        ...(product_tag && {
          product_tag: product_tag.map((tag: string) => {
            return sanitizeHtml(tag.toString().trim(), sanitizationOptions);
          }),
        }),
      };

      return next();
    } catch (error: any) {
      throw new ErrorHandler(productSanitizationError);
    }
  }
) as RequestHandler;

const deleteProductDataSanitizer = asyncHandler(
  async (
    req: TypedProductRequestBody<ProductDeleteData>,
    res: TypedProductSanitizedResponseBody,
    next: NextFunction
  ) => {
    try {
      const { _id, product_owner } = req.body;

      res.locals.sanitizedDeleteProductData = {
        _id: sanitizeHtml(_id.toString().trim(), sanitizationOptions),
        product_owner: sanitizeHtml(
          product_owner.toString().trim(),
          sanitizationOptions
        ),
      };

      return next();
    } catch (error: any) {
      throw new ErrorHandler(productSanitizationError);
    }
  }
) as RequestHandler;

export {
  addProductDataSanitizer,
  editProductDataSanitizer,
  deleteProductDataSanitizer,
};

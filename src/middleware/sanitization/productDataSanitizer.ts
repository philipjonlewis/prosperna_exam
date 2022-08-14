import path from "path";
const scriptName = path.basename(__filename);

import { Request, Response, RequestHandler, NextFunction } from "express";
import sanitizeHtml from "sanitize-html";

import asyncHandler from "../../handlers/asyncHandler";
import ErrorHandler from "../custom/modifiedErrorHandler";

const sanitizationOptions = {
  allowedTags: [],
  parser: {
    lowerCaseTags: true,
  },
};

const addProductDataSanitizer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
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
        product_price: sanitizeHtml(
          product_price.toString().trim(),
          sanitizationOptions
        ),
        product_tag: product_tag.map((tag: string) => {
          return sanitizeHtml(tag.toString().trim(), sanitizationOptions);
        }),
      };

      delete req.body;

      return next();
    } catch (error: any) {
      throw new ErrorHandler(422, "Add Product Data Sanitization Error", {
        possibleError: error.message,
        errorLocation: scriptName,
      });
    }
  }
) as RequestHandler;

const editProductDataSanitizer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
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
          product_price: sanitizeHtml(
            product_price.toString().trim(),
            sanitizationOptions
          ),
        }),
        ...(product_tag && {
          product_tag: product_tag.map((tag: string) => {
            return sanitizeHtml(tag.toString().trim(), sanitizationOptions);
          }),
        }),
      };

      delete req.body;

      return next();
    } catch (error: any) {
      throw new ErrorHandler(422, "Edit Product Data Sanitization Error", {
        possibleError: error.message,
        errorLocation: scriptName,
      });
    }
  }
) as RequestHandler;

const deleteProductDataSanitizer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { _id, product_owner } = req.body;

      res.locals.sanitizedDeleteProductData = {
        _id: sanitizeHtml(_id.toString().trim(), sanitizationOptions),
        product_owner: sanitizeHtml(
          product_owner.toString().trim(),
          sanitizationOptions
        ),
      };

      delete req.body;

      return next();
    } catch (error: any) {
      throw new ErrorHandler(422, "Delete Product Data Sanitization Error", {
        possibleError: error.message,
        errorLocation: scriptName,
      });
    }
  }
) as RequestHandler;

export {
  addProductDataSanitizer,
  editProductDataSanitizer,
  deleteProductDataSanitizer,
};

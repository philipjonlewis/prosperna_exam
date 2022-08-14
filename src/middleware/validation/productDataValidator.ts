import path from "path";
const scriptName = path.basename(__filename);

import express, {
  Express,
  Request,
  Response,
  RequestHandler,
  NextFunction,
} from "express";

import asyncHandler from "../../handlers/asyncHandler";

import ErrorHandler from "../custom/modifiedErrorHandler";

import {
  addProductDataValidationSchema,
  editProductDataValidationSchema,
  deleteProductDataValidationSchema,
} from "./productValidationSchema";

const validationOptions = {
  abortEarly: false,
  cache: false,
  // Must study this convert option to to date issues
  convert: true,
  debug: true,
  warnings: true,
};

const addProductDataValidator = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sanitizedAddProductData } = res.locals;

      await addProductDataValidationSchema
        .validateAsync(sanitizedAddProductData, validationOptions)
        .then(({ value, warning, debug }: any) => {
          res.locals.validatedAddProductData = { ...value };

          delete res.locals.sanitizedAddProductData;
          return next();
        })
        .catch((error: any) => {
          throw new ErrorHandler(
            409,
            "There seems to be something wrong with the following fields",
            error.details.map((err: any) => {
              return err.message;
            })
          );
        });
    } catch (error: any) {
      throw new ErrorHandler(422, "Add Product Validation Error", {
        possibleError: error.message,
        errorLocation: scriptName,
        ...(error.payload && { errorContent: error.payload }),
      });
    }
  }
) as RequestHandler;

const editProductDataValidator = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sanitizedEditProductData } = res.locals;

      await editProductDataValidationSchema
        .validateAsync(sanitizedEditProductData, validationOptions)
        .then(({ value, warning, debug }: any) => {
          res.locals.validatedEditProductData = { ...value };

          delete res.locals.sanitizedEditProductData;
          return next();
        })
        .catch((error: any) => {
          throw new ErrorHandler(
            409,
            "There seems to be something wrong with the following fields",
            error.details.map((err: any) => {
              return err.message;
            })
          );
        });
    } catch (error: any) {
      throw new ErrorHandler(422, "Edit Product Validation Error", {
        possibleError: error.message,
        errorLocation: scriptName,
        ...(error.payload && { errorContent: error.payload }),
      });
    }
  }
) as RequestHandler;

const deleteProductDataValidator = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sanitizedDeleteProductData } = res.locals;

      await deleteProductDataValidationSchema
        .validateAsync(sanitizedDeleteProductData, validationOptions)
        .then(({ value, warning, debug }: any) => {
          res.locals.validatedDeleteProductData = { ...value };
          delete res.locals.sanitizedEditProductData;
          return next();
        })
        .catch((error: any) => {
          throw new ErrorHandler(
            409,
            "There seems to be something wrong with the following fields",
            error.details.map((err: any) => {
              return err.message;
            })
          );
        });
    } catch (error: any) {
      throw new ErrorHandler(422, "Delete Product Validation Error", {
        possibleError: error.message,
        errorLocation: scriptName,
        ...(error.payload && { errorContent: error.payload }),
      });
    }
  }
) as RequestHandler;

export {
  addProductDataValidator,
  editProductDataValidator,
  deleteProductDataValidator,
};

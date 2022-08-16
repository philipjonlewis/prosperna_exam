import { Request, Response, RequestHandler, NextFunction } from "express";
import asyncHandler from "../handlers/asyncHandler";
import ErrorHandler from "../middleware/custom/modifiedErrorHandler";
import UserAuth from "../model/dbModel/userAuthDbModel";
import ProductModel from "../model/dbModel/productsDbModel";
import { getAllControllerError } from "../helpers/publicRoutesErrorResponse";
import type {
  TypedPublicAllUsersRequestBody,
  TypedPublicAllUsersResponseBody,
  TypedPublicAllProductsRequestBody,
  TypedPublicAllProductsResponseBody,
} from "../types/PublicRouteTypes";

import {
  getAllUsersSuccessResponse,
  getAllProductsSuccessResponse,
} from "../helpers/publicRouteSuccessResponse";

import type { GetAllUsers, GetAllProducts } from "../types/PublicRouteTypes";

export const getAllUsersController = asyncHandler(
  async (
    req: TypedPublicAllUsersRequestBody,
    res: TypedPublicAllUsersResponseBody
  ) => {
    try {
      const { count, skip } = res.locals.query;

      const allUsers = (await UserAuth.find()
        .select("+email -_id")
        .limit(count || 0)
        .skip(skip || 0)) as GetAllUsers[];

      return res.status(200).json(await getAllUsersSuccessResponse(allUsers));
    } catch (error: any) {
      throw new ErrorHandler(getAllControllerError);
    }
  }
) as RequestHandler;

export const getAllProductsController = asyncHandler(
  async (
    req: TypedPublicAllProductsRequestBody,
    res: TypedPublicAllProductsResponseBody
  ) => {
    try {
      const { count, skip } = res.locals.query;

      const allProducts = (await ProductModel.find()
        .select("-_id")
        .limit(count || 0)
        .skip(skip || 0)
        .populate("product_owner", "-_id")) as GetAllProducts[];

      return res
        .status(200)
        .json(await getAllProductsSuccessResponse(allProducts));
    } catch (error: any) {
      throw new ErrorHandler(getAllControllerError);
    }
  }
) as RequestHandler;

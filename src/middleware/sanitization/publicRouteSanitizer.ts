import path from "path";
const scriptName = path.basename(__filename);

import { Request, Response, RequestHandler, NextFunction } from "express";
import sanitizeHtml from "sanitize-html";

import asyncHandler from "../../handlers/asyncHandler";
import ErrorHandler from "../custom/modifiedErrorHandler";

import { getAllSanitizationError } from "../../helpers/publicRoutesErrorResponse";
import { isNumber } from "../../utils/isNumber";

const sanitizationOptions = {
  allowedTags: [],
  parser: {
    lowerCaseTags: true,
  },
};

const publicRouteQuerySanitizer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { count, skip } = req.query;

      if ((count && !isNumber(count)) || (skip && !isNumber(skip))) {
        throw new Error();
      }

      res.locals.query = {
        ...(count && {
          count: Number(sanitizeHtml(count.toString(), sanitizationOptions)),
        }),
        ...(skip && {
          skip: Number(sanitizeHtml(skip.toString(), sanitizationOptions)),
        }),
      };

      return next();
    } catch (error: any) {
      throw new ErrorHandler(getAllSanitizationError);
    }
  }
) as RequestHandler;

export { publicRouteQuerySanitizer };

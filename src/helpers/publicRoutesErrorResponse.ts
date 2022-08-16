import { standardProductionErrorResponse } from "./standardErrorResponse";
import { config } from "../config";

export const getAllSanitizationError =
  config.environment === "development"
    ? {
        error: { code: 422, message: "Something wrong with the query params" },
      }
    : standardProductionErrorResponse(422);

export const getAllControllerError =
  config.environment === "development"
    ? {
        error: { code: 500, message: "There seems to be something wrong" },
      }
    : standardProductionErrorResponse(500);

import { standardProductionErrorResponse } from "./standardErrorResponse";
import { config } from "../config";

export const productSanitizationError =
  config.environment === "development"
    ? {
        error: { code: 422, message: "Product Sanitization Error" },
      }
    : standardProductionErrorResponse(422);

export const productValidationError =
  config.environment === "development"
    ? {
        error: { code: 409, message: "Product Validation Error" },
      }
    : standardProductionErrorResponse(409);

export const productAuthenticationError =
  config.environment === "development"
    ? {
        error: { code: 401, message: "Product Authentication Error" },
      }
    : standardProductionErrorResponse(401);

export const productAuthorizationError =
  config.environment === "development"
    ? {
        error: { code: 401, message: "Product Authorization Error" },
      }
    : standardProductionErrorResponse(401);

export const productControllerError =
  config.environment === "development"
    ? {
        error: { code: 500, message: "Something is wrong with our server" },
      }
    : standardProductionErrorResponse(500);

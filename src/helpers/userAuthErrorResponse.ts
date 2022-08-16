import { standardProductionErrorResponse } from "./standardErrorResponse";
import { config } from "../config";

export const userAuthSanitizationError =
  config.environment === "development"
    ? {
        error: { code: 422, message: "User Sanitization Error" },
      }
    : standardProductionErrorResponse(422);

export const userAuthValidationError =
  config.environment === "development"
    ? {
        error: { code: 409, message: "User Validation Error" },
      }
    : standardProductionErrorResponse(409);

export const userAuthenticationError =
  config.environment === "development"
    ? {
        error: { code: 401, message: "User Authentication Error" },
      }
    : standardProductionErrorResponse(401);

export const userControllerError =
  config.environment === "development"
    ? {
        error: { code: 500, message: "Something is wrong with our server" },
      }
    : standardProductionErrorResponse(500);

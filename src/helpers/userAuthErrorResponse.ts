import { standardProductionErrorResponse } from "./standardErrorResponse";

export const userAuthSanitizationError =
  process.env.ENVIRONMENT == "development"
    ? {
        error: { code: 422, message: "User Sanitization Error" },
      }
    : standardProductionErrorResponse;

export const userAuthValidationError =
  process.env.ENVIRONMENT == "development"
    ? {
        error: { code: 409, message: "User Validation Error" },
      }
    : standardProductionErrorResponse;

export const userAuthenticationError =
  process.env.ENVIRONMENT == "development"
    ? {
        error: { code: 401, message: "User Authentication Error" },
      }
    : standardProductionErrorResponse;

export const userControllerError =
  process.env.ENVIRONMENT == "development"
    ? {
        error: { code: 500, message: "Something is wrong with our server" },
      }
    : standardProductionErrorResponse;

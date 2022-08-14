import { devEnvironment } from "./standardErrorResponse";
import { standardProductionErrorResponse } from "./standardErrorResponse";

export const userAuthSanitizationError = devEnvironment
  ? {
      statusCode: 422,
      message: "User Sanitization Error",
    }
  : standardProductionErrorResponse;

export const userAuthValidationError = devEnvironment
  ? {
      statusCode: 409,
      message: "User Validation Error",
    }
  : standardProductionErrorResponse;

export const userAuthenticationError = devEnvironment
  ? {
      statusCode: 401,
      message: "User Authentication Error",
    }
  : standardProductionErrorResponse;

export const userControllerError = devEnvironment
  ? {
      statusCode: 500,
      message: "Something is wrong with our server",
    }
  : standardProductionErrorResponse;

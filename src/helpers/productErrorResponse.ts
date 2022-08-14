import { devEnvironment } from "./standardErrorResponse";
import { standardProductionErrorResponse } from "./standardErrorResponse";

export const productSanitizationError = devEnvironment
  ? {
      statusCode: 422,
      message: "Product Sanitization Error",
    }
  : standardProductionErrorResponse;

export const productValidationError = devEnvironment
  ? {
      statusCode: 409,
      message: "Product Validation Error",
    }
  : standardProductionErrorResponse;

export const productAuthenticationError = devEnvironment
  ? {
      statusCode: 401,
      message: "Product Authentication Error",
    }
  : standardProductionErrorResponse;

export const productAuthorizationError = devEnvironment
  ? {
      statusCode: 401,
      message: "Product Authorization Error",
    }
  : standardProductionErrorResponse;

export const productControllerError = devEnvironment
  ? {
      statusCode: 500,
      message: "Something is wrong with our server",
    }
  : standardProductionErrorResponse;

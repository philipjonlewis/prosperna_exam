import { standardProductionErrorResponse } from "./standardErrorResponse";

export const productSanitizationError = process.env.ENVIRONMENT == "development"
  ? {
      error: { code: 422, message: "Product Sanitization Error" },
    }
  : standardProductionErrorResponse;

export const productValidationError = process.env.ENVIRONMENT == "development"
  ? {
      error: { code: 409, message: "Product Validation Error" },
    }
  : standardProductionErrorResponse;

export const productAuthenticationError = process.env.ENVIRONMENT == "development"
  ? {
      error: { code: 401, message: "Product Authentication Error" },
    }
  : standardProductionErrorResponse;

export const productAuthorizationError = process.env.ENVIRONMENT == "development"
  ? {
      error: { code: 401, message: "Product Authorization Error" },
    }
  : standardProductionErrorResponse;

export const productControllerError = process.env.ENVIRONMENT == "development"
  ? {
      error: { code: 500, message: "Something is wrong with our server" },
    }
  : standardProductionErrorResponse;

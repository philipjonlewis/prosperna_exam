import { standardProductionErrorResponse } from "./standardErrorResponse";

export const cookieAuthenticationError =
  process.env.ENVIRONMENT == "development"
    ? {
        error: { code: 401, message: "Unauthorized Access" },
      }
    : standardProductionErrorResponse;

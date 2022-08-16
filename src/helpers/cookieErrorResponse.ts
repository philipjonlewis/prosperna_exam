import { standardProductionErrorResponse } from "./standardErrorResponse";
import { config } from "../config";

export const cookieAuthenticationError =
  config.environment === "development"
    ? {
        error: { code: 401, message: "Unauthorized Access" },
      }
    : standardProductionErrorResponse(401);

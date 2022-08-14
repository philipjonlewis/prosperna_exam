import { devEnvironment } from "./standardErrorResponse";
import { standardProductionErrorResponse } from "./standardErrorResponse";

export const cookieAuthenticationError = devEnvironment
  ? {
      statusCode: 401,
      message: "Unauthorized Access",
    }
  : standardProductionErrorResponse;

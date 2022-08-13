import { Router } from "express";
import userAgent from "express-useragent";

import {
  signUpUserDataSanitizer,
  logInUserDataSanitizer,
} from "../middleware/sanitization/userAuthSanitizer";

import {
  signUpUserDataValidator,
  logInUserDataValidator,
} from "../middleware/validation/userAuthValidator";

import {
  signUpAuthenticator,
  logInAuthenticator,
} from "../middleware/authentication/userAuthAuthentication";

import {
  signUpUserDataController,
  loginUserDataController,
} from "../controllers/userAuthController";

const router = Router();
router.use(userAgent.express());

router
  .route("/signup")
  .post([
    signUpUserDataSanitizer,
    signUpUserDataValidator,
    signUpAuthenticator,
    signUpUserDataController,
  ]);

router
  .route("/login")
  .post([
    logInUserDataSanitizer,
    logInUserDataValidator,
    logInAuthenticator,
    loginUserDataController,
  ]);

export default router;

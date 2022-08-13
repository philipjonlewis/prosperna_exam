import { Router } from "express";
import userAgent from "express-useragent";

const router = Router();
router.use(userAgent.express());

import {
  refreshCookieAuthentication,
  accessCookieAuthentication,
} from "../infosec/cookies/authentication/cookieAuthentication";

import {
  signUpUserDataSanitizer,
  logInUserDataSanitizer,
  updateUserEmailSanitizer,
  updateUserPasswordSanitizer,
  deleteUserDataSanitizer,
} from "../middleware/sanitization/userAuthSanitizer";

import {
  signUpUserDataValidator,
  logInUserDataValidator,
  updateUserEmailValidator,
  updateUserPasswordValidator,
  deleteUserDataValidator,
} from "../middleware/validation/userAuthValidator";

import {
  signUpAuthenticator,
  logInAuthenticator,
  verifyUserAuthenticator,
  userCredentialsAuthenticator,
} from "../middleware/authentication/userAuthAuthentication";

import {
  signUpUserDataController,
  loginUserDataController,
  logOutUserDataController,
  verifyUserDataController,
  updateUserEmailController,
  updateUserPasswordController,
  deleteUserDataController,
} from "../controllers/userAuthController";

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

router
  .route("/logout")
  .get([
    refreshCookieAuthentication,
    accessCookieAuthentication,
    verifyUserAuthenticator,
    logOutUserDataController,
  ]);

router
  .route("/verify")
  .get([
    refreshCookieAuthentication,
    accessCookieAuthentication,
    verifyUserAuthenticator,
    verifyUserDataController,
  ]);

router
  .route("/update/email")
  .patch([
    refreshCookieAuthentication,
    accessCookieAuthentication,
    updateUserEmailSanitizer,
    updateUserEmailValidator,
    userCredentialsAuthenticator,
    updateUserEmailController,
  ]);

router
  .route("/update/password")
  .patch([
    refreshCookieAuthentication,
    accessCookieAuthentication,
    updateUserPasswordSanitizer,
    updateUserPasswordValidator,
    userCredentialsAuthenticator,
    updateUserPasswordController,
  ]);

router
  .route("/delete")
  .delete([
    refreshCookieAuthentication,
    accessCookieAuthentication,
    deleteUserDataSanitizer,
    deleteUserDataValidator,
    userCredentialsAuthenticator,
    deleteUserDataController,
  ]);

export default router;

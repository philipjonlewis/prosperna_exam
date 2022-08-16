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

/**
 * Router : User Auth
 * Description : Routes for all user auth activites
 * User Activities :
 *  - Sign Up
 *  - Log In
 *  - Log Out,
 *  - Verify,
 *  - Update Email,
 *  - Update Password,
 *  - Delete User
 */

// ! Route : http://localhost:4000/api_v1/user/signup
// * Description : API Endpoint for signing up new user
router
  .route("/signup")
  .post([
    signUpUserDataSanitizer,
    signUpUserDataValidator,
    signUpAuthenticator,
    signUpUserDataController,
  ]);

// ! Route : http://localhost:4000/api_v1/user/login
// * Description : API Endpoint for user log in
router
  .route("/login")
  .post([
    logInUserDataSanitizer,
    logInUserDataValidator,
    logInAuthenticator,
    loginUserDataController,
  ]);

// ! Route : http://localhost:4000/api_v1/user/login
// * Description : API Endpoint for user log out
router
  .route("/logout")
  .get([
    refreshCookieAuthentication,
    accessCookieAuthentication,
    verifyUserAuthenticator,
    logOutUserDataController,
  ]);

// ! Route : http://localhost:4000/api_v1/user/verify
// * Description : API Endpoint to verify if user is still logged in
router
  .route("/verify")
  .get([
    refreshCookieAuthentication,
    accessCookieAuthentication,
    verifyUserAuthenticator,
    verifyUserDataController,
  ]);

// ! Route : http://localhost:4000/api_v1/user/update/email
// * Description : API Endpoint for user to update email
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

// ! Route : http://localhost:4000/api_v1/user/update/password
// * Description : API Endpoint for user to update password
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

// ! Route : http://localhost:4000/api_v1/user/delete
// * Description : API Endpoint for user to delete their own account
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

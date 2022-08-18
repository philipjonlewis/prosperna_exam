import { Router } from 'express';
import userAgent from 'express-useragent';

const router = Router();
// Added a useragent middleware to store user device data for added security
router.use(userAgent.express());

import {
  refreshCookieAuthentication,
  accessCookieAuthentication,
} from '../infosec/cookies/authentication/cookieAuthentication';

import {
  signUpUserDataSanitizer,
  logInUserDataSanitizer,
  updateUserEmailSanitizer,
  updateUserPasswordSanitizer,
  deleteUserDataSanitizer,
} from '../middleware/sanitization/userAuthSanitizer';

import {
  signUpUserDataValidator,
  logInUserDataValidator,
  updateUserEmailValidator,
  updateUserPasswordValidator,
  deleteUserDataValidator,
} from '../middleware/validation/userAuthValidator';

import {
  signUpAuthenticator,
  logInAuthenticator,
  verifyUserAuthenticator,
} from '../middleware/authentication/userAuthAuthentication';

import {
  signUpUserDataController,
  loginUserDataController,
  logOutUserDataController,
  verifyUserDataController,
  updateUserEmailController,
  updateUserPasswordController,
  deleteUserDataController,
} from '../controllers/userAuthController';

/**
 * * Router : User Auth
 * * Description : Routes for all user auth activites
 * ! User Activities :
 * ! - Sign Up
 * ! - Log In
 * ! - Log Out,
 * ! - Verify,
 * ! - Update Email,
 * ! - Update Password,
 * ! - Delete User
 */

/**
 * * Signup and login routes have the same flow of middlewares as follows:
 *
 * 1 . Sanitizer
 *    - Sanitized incoming data with sanitize-html to prevent XSS attacks
 *
 * 2 . Validator
 *    - Validates sanitized data in accordance to database schema
 *
 * 3 . Authenticator
 *    - Authenticates if user with credentials from the cookies are valid
 *
 * 4 . Controller
 *    - Functions as the main function of the route.
 *      - Sign Up : Will add user credentials to the database and log in user
 *      - Log In : Logs in user
 */

// ! Route : http://localhost:4000/api_v1/user/signup
// * Description : API Endpoint for signing up new user
router
  .route('/signup')
  .post([
    signUpUserDataSanitizer,
    signUpUserDataValidator,
    signUpAuthenticator,
    signUpUserDataController,
  ]);

// ! Route : http://localhost:4000/api_v1/user/login
// * Description : API Endpoint for user log in
router
  .route('/login')
  .post([
    logInUserDataSanitizer,
    logInUserDataValidator,
    logInAuthenticator,
    loginUserDataController,
  ]);

/**
 * * Logout and verify routes have the same flow of middlewares as follows:
 *
 * 1 . Refresh Cookie Authentication
 *    - Authenticates if user has a valid refresh cookie
 *
 * 2 . Access Cookie Authentication
 *    - Authenticates if user has a valid access cookie
 *
 * 3 . Authenticator
 *    - Authenticates if user with credentials from the cookies are valid
 *
 * 4 . Controller
 *    - Functions as the main function of the route.
 *      - log Out : Will log out user
 *      - Verify : Will verify if logged in user is still valid
 */

// ! Route : http://localhost:4000/api_v1/user/logout
// * Description : API Endpoint for user log out
router
  .route('/logout')
  .get([
    refreshCookieAuthentication,
    accessCookieAuthentication,
    verifyUserAuthenticator,
    logOutUserDataController,
  ]);

// ! Route : http://localhost:4000/api_v1/user/verify
// * Description : API Endpoint to verify if user is still logged in
router
  .route('/verify')
  .get([
    refreshCookieAuthentication,
    accessCookieAuthentication,
    verifyUserAuthenticator,
    verifyUserDataController,
  ]);

/**
 * * Update Email, Update Password and Delete User routes have the same flow of middlewares as follows:
 *
 * 1 . Refresh Cookie Authentication
 *    - Authenticates if user has a valid refresh cookie
 *
 * 2 . Access Cookie Authentication
 *    - Authenticates if user has a valid access cookie
 *
 * 3 . Sanitizer
 *    - Sanitized incoming data with sanitize-html to prevent XSS attacks
 *
 * 4 . Validator
 *    - Validates sanitized data in accordance to database schema
 *
 * 5 . Authenticator
 *    - Authenticates if user with credentials from the cookies are valid
 *
 * 6 . Controller
 *    - Functions as the main function of the route.
 *      - Update Email : Updates user email in the database
 *      - Update Password : Hashes password and updates password in the database
 *      - Delete User : Deletes user and all associated products in the database
 */

// ! Route : http://localhost:4000/api_v1/user/update/email
// * Description : API Endpoint for user to update email
router
  .route('/update/email')
  .patch([
    refreshCookieAuthentication,
    accessCookieAuthentication,
    updateUserEmailSanitizer,
    updateUserEmailValidator,
    verifyUserAuthenticator,
    updateUserEmailController,
  ]);

// ! Route : http://localhost:4000/api_v1/user/update/password
// * Description : API Endpoint for user to update password
router
  .route('/update/password')
  .patch([
    refreshCookieAuthentication,
    accessCookieAuthentication,
    updateUserPasswordSanitizer,
    updateUserPasswordValidator,
    verifyUserAuthenticator,
    updateUserPasswordController,
  ]);

// ! Route : http://localhost:4000/api_v1/user/delete
// * Description : API Endpoint for user to delete their own account
router
  .route('/delete')
  .delete([
    refreshCookieAuthentication,
    accessCookieAuthentication,
    deleteUserDataSanitizer,
    deleteUserDataValidator,
    verifyUserAuthenticator,
    deleteUserDataController,
  ]);

export default router;

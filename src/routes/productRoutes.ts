import { Router } from "express";
const router = Router();

import {
  refreshCookieAuthentication,
  accessCookieAuthentication,
} from "../infosec/cookies/authentication/cookieAuthentication";

import { userCredentialsAuthenticator } from "../middleware/authentication/userAuthAuthentication";

import {
  addProductDataSanitizer,
  editProductDataSanitizer,
  deleteProductDataSanitizer,
} from "../middleware/sanitization/productDataSanitizer";

import {
  addProductDataValidator,
  editProductDataValidator,
  deleteProductDataValidator,
} from "../middleware/validation/productDataValidator";

import {
  addProductDataAuthorization,
  editProductDataAuthorization,
  deleteProductDataAuthorization,
} from "../middleware/authorization/productAuthorization";

import {
  addProductDataController,
  getProductDataController,
  editProductDataController,
  deleteProductDataController,
} from "../controllers/productController";

/**
 * * Router : Product
 * * Description : Routes for all product activites
 * ! User Activities :
 * ! - Create product
 * ! - Read Products or Product
 * ! - Edit Product
 * ! - Delete Product
 */

router.use([
  // Refresh Cookie Authentication
  //    - Authenticates refresh cookie of logged in user
  refreshCookieAuthentication,

  // Refresh Cookie Authentication
  //    - Authenticates access cookie of logged in user
  accessCookieAuthentication,

  // User Credentials Authenticator
  //    - Authenticates if user with credentials from the cookies are valid
  userCredentialsAuthenticator,
]);

/**
 * * All product routes have the same flow of middlewares as follows:
 *
 * 1 . Sanitization
 *    - Sanitized incoming product data with sanitize-html to prevent XSS attacks
 *
 * 2 . Validation
 *    - Validates sanitized data in accordance to database schema
 *
 * 3 . Authorization
 *    - Authenticates if user with credentials from the cookies are valid.
 *      - Create Product - If valid, product owner credential will be added
 *      - Edit & Delete - If valid, flow will proceed to the next middleware
 *
 * 4 . Controller
 *    - Functions as the main function of the route.
 *      - Create : Will add product to the database
 *      - Read : Will responsd with an array of product/s
 *      - Update : Will responsd with the updated product
 *      - Delete : Will confirm product deletion
 */

router
  .route("/")

  .get([
    // ! Route : http://localhost:4000/api_v1/products?productId=
    // * Description : API Endpoint for reading product/s
    // ! Optional query parameter for productId to get just one product
    getProductDataController,
  ])

  .post([
    // ! Route : http://localhost:4000/api_v1/products/
    // * Description : API Endpoint for cresting new product
    addProductDataSanitizer,
    addProductDataValidator,
    addProductDataAuthorization,
    addProductDataController,
  ])
  .patch([
    // ! Route : http://localhost:4000/api_v1/products/
    // * Description : API Endpoint for editing product/s
    editProductDataSanitizer,
    editProductDataValidator,
    editProductDataAuthorization,
    editProductDataController,
  ])
  .delete([
    // ! Route : http://localhost:4000/api_v1/products/
    // * Description : API Endpoint for deleting a product
    deleteProductDataSanitizer,
    deleteProductDataValidator,
    deleteProductDataAuthorization,
    deleteProductDataController,
  ]);

export default router;

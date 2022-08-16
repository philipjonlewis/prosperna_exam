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



router.use([
  refreshCookieAuthentication,
  accessCookieAuthentication,
  userCredentialsAuthenticator,
]);

router
  .route("/")
  .get([getProductDataController])
  .post([
    addProductDataSanitizer,
    addProductDataValidator,
    addProductDataAuthorization,
    addProductDataController,
  ])
  .patch([
    editProductDataSanitizer,
    editProductDataValidator,
    editProductDataAuthorization,
    editProductDataController,
  ])
  .delete([
    deleteProductDataSanitizer,
    deleteProductDataValidator,
    deleteProductDataAuthorization,
    deleteProductDataController,
  ]);

export default router;

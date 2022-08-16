import { Router } from "express";
const router = Router();
import asyncHandler from "../handlers/asyncHandler";
import {
  getAllUsersController,
  getAllProductsController,
} from "../controllers/publicRouteController";

import { publicRouteQuerySanitizer } from "../middleware/sanitization/publicRouteSanitizer";

/**
 * * Router : Public Route
 * * Description : Route to get all users and all products
 * * Done as per test instructions
 * ! User Activities :
 * ! - Get All Users
 *    - optional count & skip query parameters
 * ! - Get All Products
 *    - optional count & skip query parameters
 */

// Both routes will have the query params sanitizer to prevent parameter pollution
router.use(publicRouteQuerySanitizer);

router.route("/users").get([
  // ! Route : http://localhost:4000/api_v1/public/users?count=0&skip=0
  // * Description : API Endpoint for getting all users
  // ! Optional query parameter for productId to get just one product
  getAllUsersController,
]);

router.route("/products").get([
  // ! Route : http://localhost:4000/api_v1/public/products?count=0&skip=0
  // * Description : API Endpoint for getting all products
  // ! Optional query parameter for productId to get just one product
  getAllProductsController,
]);

export default router;

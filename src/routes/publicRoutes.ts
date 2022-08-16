import { Router } from "express";
const router = Router();
import asyncHandler from "../handlers/asyncHandler";
import {
  getAllUsersController,
  getAllProductsController,
} from "../controllers/publicRouteController";

import { publicRouteQuerySanitizer } from "../middleware/sanitization/publicRouteSanitizer";

router.use(publicRouteQuerySanitizer);

router.route("/users").get([getAllUsersController]);

router.route("/products").get([getAllProductsController]);

export default router;

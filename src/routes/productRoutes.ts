import { Router } from "express";
const router = Router();

import {
  refreshCookieAuthentication,
  accessCookieAuthentication,
} from "../infosec/cookies/authentication/cookieAuthentication";

import ProductModel from "../model/dbModel/productsDbModel";

router.use([refreshCookieAuthentication, accessCookieAuthentication]);

router.route("/").get((req, res) => {
  const { accessTokenAuthenticatedUserId } = res.locals;

  // Get all products with

  const newProduct = new ProductModel({
    product_owner: accessTokenAuthenticatedUserId,
    product_name: "Food",
    product_description: "A good food",
    product_price: 300,
    product_tag: ["food", "recipe"],
  });

  newProduct.save();

  res.send(newProduct);
});

router.route("/one/:productId").get(async (req, res) => {
  const { accessTokenAuthenticatedUserId } = res.locals;

  console.log(req.params);

  const foundProduct = await ProductModel.findOne({
    product_owner: accessTokenAuthenticatedUserId,
  });

  res.send(foundProduct);
});

// Create Product

// Update Product

// Delete Product

export default router;

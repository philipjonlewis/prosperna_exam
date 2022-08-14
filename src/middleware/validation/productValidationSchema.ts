const Joi = require("joi").extend(require("@joi/date"));

import {
  uuidValidationSchema,
  uuidValidationSchemaNotRequired,
  stringContentValidationSchema,
  booleanValidationSchema,
  dateValidationSchema,
} from "./commonValidationSchema";

const addProductDataValidationSchema = Joi.object({
  product_name: Joi.string().required(),
  product_description: Joi.string().required(),
  product_price: Joi.number().required(),
  product_tag: Joi.array().items(Joi.string()),
});

const editProductDataValidationSchema = Joi.object({
  _id: Joi.string().required(),
  product_owner: Joi.string().required(),
  product_name: Joi.string(),
  product_description: Joi.string(),
  product_price: Joi.number(),
  product_tag: Joi.array().items(Joi.string()),
});

const deleteProductDataValidationSchema = Joi.object({
  _id: Joi.string().required(),
  product_owner: Joi.string().required(),
});

export {
  addProductDataValidationSchema,
  editProductDataValidationSchema,
  deleteProductDataValidationSchema,
};

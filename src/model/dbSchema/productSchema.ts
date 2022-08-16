import mongoose from "mongoose";
const { Schema } = mongoose;

import { v4 as uuidV4 } from "uuid";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const productSchema = new Schema(
  {
    product_owner: {
      type: Schema.Types.ObjectId,
      ref: "userAuthSchema",
      required: [true, "All products must have an owner"],
    },
    product_name: {
      type: String,
      required: [true, "Product name is required"],
    },
    product_description: {
      type: String,
      required: [true, "Product description is required"],
    },
    product_price: {
      type: Number,
      required: [true, "Product price is required"],
    },
    product_tag: {
      type: [
        {
          type: String,
        },
      ],
      required: [true, "Product tag is required"],
      select: true,
    },
  },
  { versionKey: false }
);

export default productSchema;

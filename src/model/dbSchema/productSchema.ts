import mongoose from "mongoose";
const { Schema } = mongoose;

import { v4 as uuidV4 } from "uuid";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const productSchema = new Schema({
  product_name: {
    type: String,
    required: [true, "Product name is required"],
  },
  product_description: {
    type: String,
    required: [true, "Product description is required"],
  },
  product_tag: {
    type: [
      {
        type: String,
      },
    ],
    select: false,
  },
});

export default productSchema;

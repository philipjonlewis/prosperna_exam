import mongoose from "mongoose";

import productSchema from "../dbSchema/productSchema";

const ProductModel = mongoose.model("product", productSchema);

export default ProductModel;

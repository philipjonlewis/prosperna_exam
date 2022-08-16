import type { ProductData, ProductEditData } from "../types/productTypes";

export const productCreateSuccessResponse = async (
  _id: any,
  name: any,
  description: any,
  price: any,
  tag: any
) => {
  return {
    success: true,
    message: "Successfully added a product",
    payload: {
      _id: await _id,
      product_name: await name,
      product_description: await description,
      product_price: await price,
      product_tag: await tag,
    },
  };
};

export const productReadSuccessResponse = async (products: ProductData[]) => {
  return {
    success: true,
    message: "Successfully reading products",
    productCount: products.length,
    payload: products,
  };
};

export const productEditSuccessResponse = async (
  editedProductData: ProductEditData
) => {
  return {
    success: true,
    message: "Successfully Edited a Product",
    payload: editedProductData,
  };
};

export const productDeleteSuccessResponse = async (deletedProductData: {
  acknowledged: boolean;
  deletedCount: number;
}) => {
  return {
    success: true,
    message: "Successfully deleted a product",
    payload: deletedProductData,
  };
};

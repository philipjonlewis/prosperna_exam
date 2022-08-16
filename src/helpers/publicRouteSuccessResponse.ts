import type { GetAllUsers, GetAllProducts } from "../types/PublicRouteTypes";

export const getAllUsersSuccessResponse = async (allUsers: GetAllUsers[]) => {
  return {
    success: true,
    message: "All Users",
    payload: allUsers,
  };
};

export const getAllProductsSuccessResponse = async (
  allProducts: GetAllProducts[]
) => {
  return {
    success: true,
    message: "All Users",
    payload: allProducts,
  };
};

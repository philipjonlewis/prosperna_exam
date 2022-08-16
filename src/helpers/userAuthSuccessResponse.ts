import { IdType } from "../types/commonTypes";

export const userAuthSignUpSuccessResponse = async (
  _id: IdType,
  email: string
) => {
  return {
    success: true,
    message: "Successfully Signed Up",
    payload: {
      _id: _id.toString(),
      email: email.toString(),
    },
  };
};

export const userAuthLogInSuccessResponse = async (
  _id: IdType,
  email: string
) => {
  return {
    success: true,
    message: "Successfully Logged In",
    payload: {
      _id: await _id.toString(),
      email: email.toString(),
    },
  };
};

export const userAuthlogOutSuccessResponse = {
  success: true,
  message: "Logged Out",
};

export const userAuthVerifyUserSuccessResponse = {
  success: true,
  message: "Logged Out",
};

export const userAuthUpdateEmailSuccessResponse = async (
  _id: IdType,
  oldEmail: string,
  email: string
) => {
  return {
    success: true,
    message: "Successfully changed email - Please Log In Again",
    payload: {
      _id,
      oldEmail,
      email,
    },
  };
};

export const userAuthUpdatePasswordSuccessResponse = async (
  _id: IdType,
  email: string
) => {
  return {
    success: true,
    message: "Successfully changed password - Please Log In Again",
    payload: {
      _id: _id.toString(),
      email: email.toString(),
    },
  };
};

export const userAuthDeleteUserSuccessResponse = {
  success: true,
  message: "Deleted User",
};

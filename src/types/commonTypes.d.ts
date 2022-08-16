import Types from mongoose

import type {
  UserSignupData,
  UserLogInData,
  UpdateUserEmailData,
  UpdateUserPasswordData,
  UserDeleteData,
} from "./userAuthTypes";

export type IdType = Types.ObjectId | string;


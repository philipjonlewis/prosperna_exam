import { Request, Response, NextFunction, response } from "express";

export interface UserSignupData {
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface UserLogInData {
  email: string;
  password: string;
}

export interface UpdateUserEmailData {
  email: string;
  newEmail: string;
  password: string;
}

export interface UpdateUserPasswordData {
  email: string;
  password: string;
  newPassword: string;
}

export interface UserDeleteData extends UserSignupData {}

export interface TypedRequestBody<T = {}> extends Request {
  body: T;
}

export interface TypedSanitizedResponseBody extends Response {
  locals: {
    sanitizedSignUpUserData: UserSignupData;
    sanitizedLogInUserData: UserLogInData;
    sanitizedEditUserEmail: UpdateUserEmailData;
    sanitizedEditUserPassword: UpdateUserPasswordData;
    sanitizedDeleteUserData: UserDeleteData;
  };
  // json({ code: number, status: boolean, message: string, payload: Y });
}

export interface TypedValidatedResponseBody extends Response {
  locals: {
    sanitizedSignUpUserData?: UserSignupData;
    validatedSignUpUserData: UserSignupData;

    sanitizedLogInUserData?: UserLogInData;
    validatedLogInUserData: UserLogInData;

    sanitizedEditUserEmail?: UpdateUserEmailData;
    validatedEditUserEmail: UpdateUserEmailData;

    sanitizedEditUserPassword?: UpdateUserPasswordData;
    validatedEditUserPassword: UpdateUserPasswordData;

    sanitizedDeleteUserData?: UserDeleteData;
    validatedDeleteUserData: UserDeleteData;
  };
  // json({ code: number, status: boolean, message: string, payload: Y });
}

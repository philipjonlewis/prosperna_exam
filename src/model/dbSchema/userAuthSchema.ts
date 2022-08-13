import mongoose from "mongoose";
const { Schema } = mongoose;

import { v4 as uuidV4 } from "uuid";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { emailRegex, passwordRegex } from "../../utils/regexValidators";

const userAuthSchema = new Schema({
  email: {
    type: String,
    required: [true, "email is required"],
    trim: true,
    unique: true,
    max: 256,
    match: emailRegex,
    select: false,
  },
  password: {
    type: String,
    required: [true, "password is required"],
    min: 6,
    max: 32,
    match: passwordRegex,
    select: false,
  },
  passwordConfirmation: {
    type: String,
    required: [true, "password is required"],
    min: 6,
    max: 32,
    match: passwordRegex,
    select: false,
  },
  refreshToken: {
    type: String,
    select: false,
  },
  accessToken: {
    type: String,
    select: false,
  },
  userAgent: {
    type: [],
    select: false,
  },
});

userAuthSchema.pre("save", async function (next) {
  try {
    // //expires in 28 days
    const refreshToken = jwt.sign(
      { token: this._id },
      process.env.AUTH_TOKEN_KEY as string,
      {
        issuer: this._id.toString(),
        subject: this.email,
        audience: "/",
        expiresIn: "672h",
        algorithm: "HS256",
      }
    ) as any;
    //expires in 1 day
    const accessToken = jwt.sign(
      { token: this._id },
      process.env.AUTH_TOKEN_KEY as string,
      {
        issuer: this._id.toString(),
        subject: this.email,
        audience: "/",
        expiresIn: "24h",
        algorithm: "HS256",
      }
    ) as any;

    this.refreshToken = await refreshToken;
    this.accessToken = await accessToken;

    if (!this.isModified("password")) {
      return next();
    }
    console.log("this should be running");
    this.password = await bcrypt.hash(this.password, 10);
    this.passwordConfirmation = await bcrypt.hash(
      this.passwordConfirmation,
      10
    );

    return next();
  } catch (error) {
    // Make an error log schema and reference this type of error to that
    console.log(error);
    console.log("error from auth user db");
  }
});

export default userAuthSchema;

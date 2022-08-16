import mongoose from "mongoose";
const { Schema } = mongoose;
import { v4 as uuidV4 } from "uuid";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { emailRegex, passwordRegex } from "../../utils/regexValidators";

const userAuthSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "email is required"],
      trim: true,
      unique: true,
      max: 256,
      match: emailRegex,
      select: true,
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
  },
  { versionKey: false }
);

userAuthSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }

    this.password = await bcrypt.hash(this.password, 10);
    this.passwordConfirmation = await bcrypt.hash(
      this.passwordConfirmation,
      10
    );

    return next();
  } catch (error) {
    console.log(error);
    console.log("error from auth user db");
  }
});

export default userAuthSchema;

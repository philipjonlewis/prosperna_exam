import mongoose from "mongoose";
const { Schema } = mongoose;

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
    // min: 6,
    // max: 32,
    // match: passwordRegex,
    select: false,
  },
  passwordConfirmation: {
    type: String,
    required: [true, "password is required"],
    // min: 6,
    // max: 32,
    // match: passwordRegex,
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

export default userAuthSchema;

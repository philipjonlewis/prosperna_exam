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
});

export default userAuthSchema;

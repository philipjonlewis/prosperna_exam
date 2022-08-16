import mongoose from "mongoose";
import path from "path";
import { config } from "../config";
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const mongooseOptions: any = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const dbPort: any =
  config.environment == "development"
    ? process.env.DB_PORT_DEVELOPMENT
    : process.env.DB_PORT_PRODUCTION;

const databaseConnection = async () => {
  try {
    mongoose.connect(dbPort, mongooseOptions);
    console.log("Connected to the database");
  } catch (error) {
    console.log("Unable to Connect to the database", error);
  }
};

export { databaseConnection };

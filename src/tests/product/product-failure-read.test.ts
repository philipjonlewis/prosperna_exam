import request from "supertest";
import app from "../../app";
import { describe, expect, test, beforeAll, afterAll, afterEach } from "vitest";
import { databaseConnection } from "../../model/dbConnection";
import UserAuth from "../../model/dbModel/userAuthDbModel";
import ProductModel from "../../model/dbModel/productsDbModel";
import {
  signedRefreshToken,
  signedAccessToken,
} from "../../utils/cookieOptions";
import { Types } from "mongoose";

import { cookieAuthenticationError } from "../../helpers/cookieErrorResponse";

const testUserCredentials = {
  email: "userreadproducttest@email.com",
  password: "SamplePassword888!",
  passwordConfirmation: "SamplePassword888!",
  newEmail: "userauthsuccessnewemail@test.com",
  newPassword: "PeoplePerson612!",
};

const testProductData = {
  product_name: "Product Testing Name",
  product_description: "Product testing description",
  product_price: 999,
  product_tag: ["First Tag", "Second Tag", "Third Tag"],
};

const incompleteTestProductData = {
  product_description: testProductData.product_description,
  product_price: testProductData.product_price,
  product_tag: testProductData.product_tag,
};

let userId: Types.ObjectId;

describe("Product API - Read - Failure", () => {
  beforeAll(async () => {
    await databaseConnection();

    const newUser = new UserAuth({
      email: testUserCredentials.email,
      password: testUserCredentials.password,
      passwordConfirmation: testUserCredentials.passwordConfirmation,
    });

    const { _id, email } = newUser;

    const refreshToken = await signedRefreshToken(_id.toString(), email);
    const accessToken = await signedAccessToken(_id.toString(), email);

    await UserAuth.findByIdAndUpdate(_id, {
      refreshToken,
      accessToken,
    });

    userId = newUser._id;

    await newUser.save();
  });

  afterAll(async () => {
    await UserAuth.findOneAndDelete({ email: testUserCredentials.email });
    await ProductModel.deleteMany({ product_owner: userId });
  });

  afterEach(async () => {
    await ProductModel.deleteMany({ product_owner: userId });
  });

  test("Read Product - Not Logged In", async () => {
    const getProduct = await request(app)
      .get("/products")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(cookieAuthenticationError.statusCode);

    expect(getProduct.body).toEqual(
      expect.objectContaining(cookieAuthenticationError)
    );
  });

  test("Read Product - Non-Existent Product Id", async () => {
    const loginRes = await request(app).post("/user/login").send({
      email: testUserCredentials.email,
      password: testUserCredentials.password,
    });

    await request(app)
      .post("/products")
      .set("Cookie", [...loginRes.header["set-cookie"]])
      .send(testProductData)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(201);

    const getProduct = await request(app)
      .get("/products?productId=62f86e1971c9d2cfd98bccd8")
      .set("Cookie", [...loginRes.header["set-cookie"]])
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(201);

    expect(getProduct.body).toEqual(
      expect.objectContaining({
        success: true,
        message: "Successfully reading products",
        productCount: 0,
        payload: expect.arrayContaining([]),
      })
    );
  });
});
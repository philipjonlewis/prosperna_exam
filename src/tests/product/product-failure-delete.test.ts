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
import { productSanitizationError } from "../../helpers/productErrorResponse";

const testUserCredentials = {
  email: "userdeleteproducttest@email.com",
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

describe("Product API - Delete - Failure", () => {
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

  test("Delete Product - Not Logged In", async () => {
    const deleteProduct = await request(app)
      .delete("/products")
      .send(testProductData)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(cookieAuthenticationError.statusCode);

    expect(deleteProduct.body).toEqual(
      expect.objectContaining(cookieAuthenticationError)
    );
  });

  test("Delete Product - Incomplete Data", async () => {
    const loginRes = await request(app).post("/user/login").send({
      email: testUserCredentials.email,
      password: testUserCredentials.password,
    });

    const addedProject = await request(app)
      .post("/products")
      .set("Cookie", [...loginRes.header["set-cookie"]])
      .send(testProductData)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(201);

    const deleteProduct = await request(app)
      .delete("/products")
      .set("Cookie", [...loginRes.header["set-cookie"]])
      .send({
        product_owner: userId,
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(productSanitizationError.statusCode);

    expect(deleteProduct.body).toEqual(
      expect.objectContaining(productSanitizationError)
    );
  });
});

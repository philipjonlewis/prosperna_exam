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

const testUserCredentials = {
  email: "userproduct@email.com",
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

let userId: Types.ObjectId;

describe("Product API - Success", () => {
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

  test("Create Product", async () => {
    const loginRes = await request(app).post("/user/login").send({
      email: testUserCredentials.email,
      password: testUserCredentials.password,
    });

    const addProduct = await request(app)
      .post("/products")
      .set("Cookie", [...loginRes.header["set-cookie"]])
      .send(testProductData)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(201);

    expect(addProduct.body).toEqual(
      expect.objectContaining({
        success: true,
        message: "Successfully added a product",
        payload: expect.objectContaining({
          _id: expect.any(String),
          product_name: expect.any(String),
          product_description: expect.any(String),
          product_price: expect.any(Number),
        }),
      })
    );
  });

  test("Read Product", async () => {
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
      .get("/products")
      .set("Cookie", [...loginRes.header["set-cookie"]])
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(201);

    expect(getProduct.body).toEqual(
      expect.objectContaining({
        success: true,
        message: "Successfully reading products",
        productCount: expect.any(Number),
        payload: expect.arrayContaining([
          expect.objectContaining({
            _id: expect.any(String),
            product_name: expect.any(String),
            product_description: expect.any(String),
            product_price: expect.any(Number),
            product_tag: expect.arrayContaining([expect.any(String)]),
          }),
        ]),
      })
    );
  });

  test("Update Product", async () => {
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

    const editProduct = await request(app)
      .patch("/products")
      .set("Cookie", [...loginRes.header["set-cookie"]])
      .send({
        _id: addedProject.body.payload._id,
        product_owner: userId,
        product_name: "Edited Product Name",
        product_description: "Edited product testing description",
        product_price: 100,
        product_tag: ["First Edit Tag", "Second Edit Tag", "Third Edit Tag"],
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(editProduct.body).toEqual(
      expect.objectContaining({
        success: true,
        message: "Successfully edited product",
        payload: expect.objectContaining({
          _id: expect.any(String),
          product_owner: expect.any(String),
          product_name: expect.any(String),
          product_description: expect.any(String),
          product_price: expect.any(Number),
          product_tag: expect.arrayContaining([expect.any(String)]),
        }),
      })
    );
  });

  test("Delete Product", async () => {
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
        _id: addedProject.body.payload._id,
        product_owner: userId,
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(deleteProduct.body).toEqual(
      expect.objectContaining({
        success: true,
        message: "Successfully deleted a product",
        payload: expect.objectContaining({
          acknowledged: expect.any(Boolean),
          deletedCount: expect.any(Number),
        }),
      })
    );
  });
});

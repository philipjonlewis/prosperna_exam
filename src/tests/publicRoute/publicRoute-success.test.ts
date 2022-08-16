import request from "supertest";
import app from "../../app";
import { config } from "../../config";
import { describe, expect, test } from "vitest";

import {
  getAllUsersSuccessResponse,
  getAllProductsSuccessResponse,
} from "../../helpers/publicRouteSuccessResponse";

describe("Public Route API - Success", () => {
  test("Get All Users", async () => {
    const getAllUsers = await request(app)
      .get(`${config.URL}/public/users`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(getAllUsers.body).toEqual(
      expect.objectContaining(
        await getAllUsersSuccessResponse(getAllUsers.body.payload)
      )
    );
  });
  test("Get All Products", async () => {
    const getAllProducts = await request(app)
      .get(`${config.URL}/public/products`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(getAllProducts.body).toEqual(
      expect.objectContaining(
        await getAllProductsSuccessResponse(getAllProducts.body.payload)
      )
    );
  });
});

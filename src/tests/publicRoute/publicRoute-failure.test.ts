import request from "supertest";
import app from "../../app";
import { config } from "../../config";
import { describe, expect, test } from "vitest";

import { getAllSanitizationError } from "../../helpers/publicRoutesErrorResponse";

describe("Public Route API - Failure", () => {
  test("Get All Users - Invalid Query Params", async () => {
    const getAllUsers = await request(app)
      .get(`${config.URL}/public/users?count=hello&skip=true`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(422);

    expect(getAllUsers.body).toEqual(
      expect.objectContaining(getAllSanitizationError)
    );
  });
  test("Get All Products - Invalid Query Params", async () => {
    const getAllProducts = await request(app)
      .get(`${config.URL}/public/products?count=hello&skip=true`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(422);

    expect(getAllProducts.body).toEqual(
      expect.objectContaining(getAllSanitizationError)
    );
  });
});

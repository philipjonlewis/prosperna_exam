import request from "supertest";
import app from "../app";
import { describe, expect, test, beforeAll, afterAll } from "vitest";
import { databaseConnection } from "../model/dbConnection";
import UserAuth from "../model/dbModel/userAuthDbModel";
import { signedRefreshToken, signedAccessToken } from "../utils/cookieOptions";

const testUserCredentials = {
  email: "testemail@email.com",
  password: "SamplePassword888!",
  passwordConfirmation: "SamplePassword888!",
};

describe("User Auth API", () => {
  beforeAll(async () => {
    await databaseConnection();
  });

  test("Sign Up - Success", async () => {
    const res = await request(app)
      .post("/user/signup")
      .send({
        email: testUserCredentials.email,
        password: testUserCredentials.password,
        passwordConfirmation: testUserCredentials.passwordConfirmation,
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(res.body).toEqual(
      expect.objectContaining({
        code: 200,
        status: expect.any(Boolean),
        message: expect.any(String),
        payload: expect.objectContaining({
          _id: expect.any(String),
          email: expect.any(String),
        }),
      })
    );

    await UserAuth.findOneAndDelete({ email: testUserCredentials.email });
  });

  test("Log In - Success", async () => {
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

    await newUser.save();

    const res = await request(app)
      .post("/user/login")
      .send({
        email: testUserCredentials.email,
        password: testUserCredentials.password,
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(res.body).toEqual(
      expect.objectContaining({
        code: 200,
        status: true,
        message: expect.any(String),
        payload: expect.objectContaining({
          _id: expect.any(String),
          email: expect.any(String),
        }),
      })
    );

    await UserAuth.findOneAndDelete({ email: testUserCredentials.email });
  });
});

import request from "supertest";
import app from "../app";
import { describe, expect, test, beforeAll, afterAll, afterEach } from "vitest";
import { databaseConnection } from "../model/dbConnection";
import UserAuth from "../model/dbModel/userAuthDbModel";
import { signedRefreshToken, signedAccessToken } from "../utils/cookieOptions";

const testUserCredentials = {
  email: "testemail",
  password: "SamplePassword",
  passwordConfirmation: "SamplePassword888!",
};

describe("User Auth API - Failure", () => {
  beforeAll(async () => {
    await databaseConnection();
  });

  afterEach(async () => {
    await UserAuth.findOneAndDelete({
      email: testUserCredentials.email + "@email.com",
    });
  });

  test("Sign Up - Failure - Email", async () => {
    const res = await request(app)
      .post("/user/signup")
      .send({
        email: testUserCredentials.email,
        password: testUserCredentials.password + "888!",
        passwordConfirmation: testUserCredentials.passwordConfirmation,
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(res.body).toEqual(
      expect.objectContaining({
        code: 409,
        status: false,
        message: "There seems to be something wrong with the following fields",
        payload: expect.arrayContaining([expect.stringContaining("email")]),
      })
    );
  });

  test("Sign Up - Failure - Password", async () => {
    const res = await request(app)
      .post("/user/signup")
      .send({
        email: testUserCredentials.email + "@email.com",
        password: testUserCredentials.password,
        passwordConfirmation: testUserCredentials.passwordConfirmation,
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(res.body).toEqual(
      expect.objectContaining({
        code: 409,
        status: false,
        message: "There seems to be something wrong with the following fields",
        payload: expect.arrayContaining([expect.stringContaining("password")]),
      })
    );
  });

  test("Sign Up - Failure - Password Confirmation", async () => {
    const res = await request(app)
      .post("/user/signup")
      .send({
        email: testUserCredentials.email + "@email.com",
        password: testUserCredentials.password + "888!",
        passwordConfirmation: "PeoplePower666!",
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(res.body).toEqual(
      expect.objectContaining({
        code: 409,
        status: false,
        message: "There seems to be something wrong with the following fields",
        payload: expect.arrayContaining([
          expect.stringContaining("passwordConfirmation"),
        ]),
      })
    );
  });

  test("Log In - Failure - Email", async () => {
    const newUser = new UserAuth({
      email: testUserCredentials.email + "@email.com",
      password: testUserCredentials.password + "888!",
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
        password: testUserCredentials.password + "888!",
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(res.body).toEqual(
      expect.objectContaining({
        code: 409,
        status: false,
        message: "There seems to be something wrong with the following fields",
        payload: expect.arrayContaining([expect.stringContaining("email")]),
      })
    );

    await UserAuth.findOneAndDelete({ email: testUserCredentials.email });
  });
});

import request from "supertest";
import app from "../../app";
import { describe, expect, test, beforeAll, afterAll, afterEach } from "vitest";
import { databaseConnection } from "../../model/dbConnection";
import UserAuth from "../../model/dbModel/userAuthDbModel";
import {
  signedRefreshToken,
  signedAccessToken,
} from "../../utils/cookieOptions";

const testUserCredentials = {
  email: "userauthfailurelogin",
  password: "SamplePassword",
  passwordConfirmation: "SamplePassword888!",
};

describe("User Auth API - Failure - Log In", () => {
  beforeAll(async () => {
    await databaseConnection();

    await UserAuth.findOneAndDelete({
      email: testUserCredentials.email + "@email.com",
    });
  });

  afterEach(async () => {
    await UserAuth.findOneAndDelete({
      email: testUserCredentials.email + "@email.com",
    });
  });

  test("Log In - Failure - Email Format", async () => {
    const res = await request(app)
      .post("/user/login")
      .send({
        email: testUserCredentials.email,
        password: testUserCredentials.password + "888!",
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(422);

    expect(res.body).toEqual(
      expect.objectContaining({
        success: false,
        message: "User Log In Validation Error",
        payload: expect.objectContaining({
          possibleError: expect.any(String),
          errorLocation: expect.any(String),
          errorContent: expect.arrayContaining([
            expect.stringContaining("email"),
          ]),
        }),
      })
    );
  });

  test("Log In - Failure - Password Format", async () => {
    const res = await request(app)
      .post("/user/login")
      .send({
        email: testUserCredentials.email + "@email.com",
        password: "SamplePassword777",
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(422);

    expect(res.body).toEqual(
      expect.objectContaining({
        success: false,
        message: "User Log In Validation Error",
        payload: expect.objectContaining({
          possibleError:
            "There seems to be something wrong with the following fields",
          errorLocation: expect.any(String),
          errorContent: expect.arrayContaining([
            expect.stringContaining("password"),
          ]),
        }),
      })
    );
  });

  test("Log In - Failure - Invalid Password", async () => {
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
        email: testUserCredentials.email + "@email.com",
        password: "PeoplePerson777!",
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(401);

    expect(res.body).toEqual(
      expect.objectContaining({
        success: false,
        message: "User Log In Controller Error",
        payload: expect.objectContaining({
          possibleError: "Try Logging in again",
          errorLocation: expect.any(String),
        }),
      })
    );
  });

  test("Log In - Failure - Non-Existing User", async () => {
    const res = await request(app)
      .post("/user/login")
      .send({
        email: "anothertestemail@gmail.com",
        password: testUserCredentials.password + "888!",
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(401);

    expect(res.body).toEqual(
      expect.objectContaining({
        success: false,
        message: "User Log In Authentication Error",
        payload: expect.objectContaining({
          possibleError: "User Log In Authentication Error",
          errorLocation: expect.any(String),
        }),
      })
    );
  });
});

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
  email: "userauthfailuresignup",
  password: "SamplePassword",
  passwordConfirmation: "SamplePassword888!",
};

describe("User Auth API - Failure - Sign Up", () => {
  beforeAll(async () => {
    await databaseConnection();
  });

  afterEach(async () => {
    await UserAuth.findOneAndDelete({
      email: testUserCredentials.email + "@email.com",
    });
  });

  test("Sign Up - Failure - Email Format", async () => {
    const res = await request(app)
      .post("/user/signup")
      .send({
        email: testUserCredentials.email,
        password: testUserCredentials.password + "888!",
        passwordConfirmation: testUserCredentials.passwordConfirmation,
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(422);

    expect(res.body).toEqual(
      expect.objectContaining({
        success: false,
        message: "User Sign Up Validation Error",
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

  test("Sign Up - Failure - Existing User", async () => {
    const newUser = new UserAuth({
      email: "existinguser@email.com",
      password: "ExistingUser888!",
      passwordConfirmation: "ExistingUser888!",
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
      .post("/user/signup")
      .send({
        email: "existinguser@email.com",
        password: "ExistingUser888!",
        passwordConfirmation: "ExistingUser888!",
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(401);

    expect(res.body).toEqual(
      expect.objectContaining({
        success: false,
        message: "User Signup Authentication Error",
        payload: expect.objectContaining({
          possibleError: expect.any(String),
          errorLocation: expect.any(String),
        }),
      })
    );

    await UserAuth.findOneAndDelete({
      email: "existinguser@email.com",
    });
  });

  test("Sign Up - Failure - Password Format", async () => {
    const res = await request(app)
      .post("/user/signup")
      .send({
        email: testUserCredentials.email + "@email.com",
        password: testUserCredentials.password,
        passwordConfirmation: testUserCredentials.passwordConfirmation,
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(422);

    expect(res.body).toEqual(
      expect.objectContaining({
        success: false,
        message: "User Sign Up Validation Error",
        payload: expect.objectContaining({
          possibleError: expect.any(String),
          errorLocation: expect.any(String),
          errorContent: expect.arrayContaining([
            expect.stringContaining("password"),
          ]),
        }),
      })
    );
  });

  test("Sign Up - Failure - Password Confirmation Similarity & Format", async () => {
    const res = await request(app)
      .post("/user/signup")
      .send({
        email: testUserCredentials.email + "@email.com",
        password: testUserCredentials.password + "888!",
        passwordConfirmation: "PeoplePower666!",
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(422);

    expect(res.body).toEqual(
      expect.objectContaining({
        success: false,
        message: "User Sign Up Validation Error",
        payload: expect.objectContaining({
          possibleError: expect.any(String),
          errorLocation: expect.any(String),
          errorContent: expect.arrayContaining([
            expect.stringContaining("passwordConfirmation"),
          ]),
        }),
      })
    );
  });
});

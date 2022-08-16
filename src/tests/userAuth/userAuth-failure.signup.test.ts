import request from "supertest";
import app from "../../app";
import { config } from "../../config";
import {
  describe,
  expect,
  test,
  afterEach,
  beforeEach,
} from "vitest";
import UserAuth from "../../model/dbModel/userAuthDbModel";
import {
  signedRefreshToken,
  signedAccessToken,
} from "../../utils/cookieOptions";

import {
  userAuthValidationError,
  userAuthenticationError,
} from "../../helpers/userAuthErrorResponse";

const testUserCredentials = {
  email: "userauthfailuresignup",
  password: "SamplePassword",
  passwordConfirmation: "SamplePassword888!",
};

describe("User Auth API - Failure - Sign Up", () => {
  beforeEach(async () => {
    await UserAuth.findOneAndDelete({
      email: testUserCredentials.email + "@email.com",
    });
  });

  afterEach(async () => {
    await UserAuth.findOneAndDelete({
      email: testUserCredentials.email + "@email.com",
    });
  });

  test("Invalid Email Format", async () => {
    const res = await request(app)
      .post(`${config.URL}/user/signup`)
      .send({
        email: testUserCredentials.email,
        password: testUserCredentials.password + "888!",
        passwordConfirmation: testUserCredentials.passwordConfirmation,
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(userAuthValidationError.error.code);

    expect(res.body).toEqual(expect.objectContaining(userAuthValidationError));
  });

  test("Existing User", async () => {
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
      .post(`${config.URL}/user/signup`)
      .send({
        email: "existinguser@email.com",
        password: "ExistingUser888!",
        passwordConfirmation: "ExistingUser888!",
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(userAuthenticationError.error.code);

    expect(res.body).toEqual(expect.objectContaining(userAuthenticationError));

    await UserAuth.findOneAndDelete({
      email: "existinguser@email.com",
    });
  });

  test("Invalid Password Format", async () => {
    const res = await request(app)
      .post(`${config.URL}/user/signup`)
      .send({
        email: testUserCredentials.email + "@email.com",
        password: testUserCredentials.password,
        passwordConfirmation: testUserCredentials.passwordConfirmation,
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(userAuthValidationError.error.code);

    expect(res.body).toEqual(expect.objectContaining(userAuthValidationError));
  });

  test("Password Confirmation Similarity & Format", async () => {
    const res = await request(app)
      .post(`${config.URL}/user/signup`)
      .send({
        email: testUserCredentials.email + "@email.com",
        password: testUserCredentials.password + "888!",
        passwordConfirmation: "PeoplePower666!",
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(userAuthValidationError.error.code);

    expect(res.body).toEqual(expect.objectContaining(userAuthValidationError));
  });
});

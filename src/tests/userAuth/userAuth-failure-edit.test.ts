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

const testUserCredentials = {
  email: "userauthfailureedit@email.com",

  password: "SamplePassword888!",
  passwordConfirmation: "SamplePassword888!",
};

import {
  userAuthValidationError,
  userAuthenticationError,
} from "../../helpers/userAuthErrorResponse";

describe("User Auth API - Failure - Edit", () => {
  beforeEach(async () => {
    await UserAuth.findOneAndDelete({
      email: testUserCredentials.email,
    });
  });

  afterEach(async () => {
    await UserAuth.findOneAndDelete({
      email: testUserCredentials.email,
    });
  });

  test("Invalid New Email Format", async () => {
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

    const loginRes = await request(app).post(`${config.URL}/user/login`).send({
      email: testUserCredentials.email,
      password: testUserCredentials.password,
    });

    const editEmail = await request(app)
      .patch(`${config.URL}/user/update/email`)
      .send({
        email: testUserCredentials.email,
        newEmail: "newuserauthfailureeditemail.com",
        password: testUserCredentials.password,
      })
      .set("Cookie", [...loginRes.header["set-cookie"]])
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(userAuthValidationError.error.code);

    expect(editEmail.body).toEqual(
      expect.objectContaining(userAuthValidationError)
    );
  });

  test("Invalid New Password Format", async () => {
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

    const loginRes = await request(app).post(`${config.URL}/user/login`).send({
      email: testUserCredentials.email,
      password: testUserCredentials.password,
    });

    const editEmail = await request(app)
      .patch(`${config.URL}/user/update/password`)
      .send({
        email: testUserCredentials.email,
        password: testUserCredentials.password,
        newPassword: "NewPassword732",
      })
      .set("Cookie", [...loginRes.header["set-cookie"]])
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(userAuthValidationError.error.code);

    expect(editEmail.body).toEqual(
      expect.objectContaining(userAuthValidationError)
    );
  });
});

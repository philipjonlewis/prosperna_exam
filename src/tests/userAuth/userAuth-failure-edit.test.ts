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
  email: "userauthfailureedit@email.com",

  password: "SamplePassword888!",
  passwordConfirmation: "SamplePassword888!",
};

describe("User Auth API - Failure - Edit", () => {
  beforeAll(async () => {
    await databaseConnection();

    await UserAuth.findOneAndDelete({
      email: testUserCredentials.email,
    });
  });

  afterEach(async () => {
    await UserAuth.findOneAndDelete({
      email: testUserCredentials.email,
    });
  });

  test("Edit Email - Failure - New Email Format", async () => {
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

    const loginRes = await request(app).post("/user/login").send({
      email: testUserCredentials.email,
      password: testUserCredentials.password,
    });

    const editEmail = await request(app)
      .patch("/user/update/email")
      .send({
        email: testUserCredentials.email,
        newEmail: "newuserauthfailureeditemail.com",
        password: testUserCredentials.password,
      })
      .set("Cookie", [...loginRes.header["set-cookie"]])
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(422);

    expect(editEmail.body).toEqual(
      expect.objectContaining({
        success: false,
        message: "User Update Email Validation Error",
        payload: expect.objectContaining({
          possibleError: expect.any(String),
          errorLocation: expect.any(String),
          errorContent: expect.arrayContaining([
            expect.stringContaining("newEmail"),
          ]),
        }),
      })
    );
  });

  test("Edit Password - Failure - New Password Format", async () => {
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

    const loginRes = await request(app).post("/user/login").send({
      email: testUserCredentials.email,
      password: testUserCredentials.password,
    });

    const editEmail = await request(app)
      .patch("/user/update/password")
      .send({
        email: testUserCredentials.email,
        password: testUserCredentials.password,
        newPassword: "NewPassword732",
      })
      .set("Cookie", [...loginRes.header["set-cookie"]])
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(422);

    expect(editEmail.body).toEqual(
      expect.objectContaining({
        success: false,
        message: "User Update Password Validation Error",
        payload: expect.objectContaining({
          possibleError: expect.any(String),
          errorLocation: expect.any(String),
          errorContent: expect.arrayContaining([
            expect.stringContaining("newPassword"),
          ]),
        }),
      })
    );
  });
});

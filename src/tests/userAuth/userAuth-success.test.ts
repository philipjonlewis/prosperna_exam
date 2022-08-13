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
  email: "userauthsuccess@email.com",
  password: "SamplePassword888!",
  passwordConfirmation: "SamplePassword888!",
  newEmail: "userauthsuccessnewemail@test.com",
  newPassword: "PeoplePerson612!",
};

describe("User Auth API - Success", () => {
  beforeAll(async () => {
    await databaseConnection();
    await UserAuth.findOneAndDelete({ email: testUserCredentials.email });
    await UserAuth.findOneAndDelete({ email: testUserCredentials.newEmail });
  });

  afterEach(async () => {
    await UserAuth.findOneAndDelete({ email: testUserCredentials.email });
    await UserAuth.findOneAndDelete({ email: testUserCredentials.newEmail });
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
        success: true,
        message: "Successfully Signed Up",
        payload: expect.objectContaining({
          _id: expect.any(String),
          email: expect.any(String),
        }),
      })
    );
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
        success: true,
        message: "Successfully logged in",
        payload: expect.objectContaining({
          _id: expect.any(String),
          email: expect.any(String),
        }),
      })
    );
  });

  test("Log Out - Success", async () => {
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

    const logoutRes = await request(app)
      .get("/user/logout")
      .set("Cookie", [...loginRes.header["set-cookie"]])
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(logoutRes.body).toEqual(
      expect.objectContaining({
        success: true,
        message: "Logged Out",
      })
    );
  });

  test("Verify User - Success", async () => {
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

    const verifyUser = await request(app)
      .get("/user/verify")
      .set("Cookie", [...loginRes.header["set-cookie"]])
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(verifyUser.body).toEqual(
      expect.objectContaining({
        success: true,
        message: "User is still logged in",
      })
    );
  });

  test("Edit Email - Success", async () => {
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
        newEmail: testUserCredentials.newEmail,
        password: testUserCredentials.password,
      })
      .set("Cookie", [...loginRes.header["set-cookie"]])
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(editEmail.body).toEqual(
      expect.objectContaining({
        success: true,
        message: "Successfully changed email",
        payload: expect.objectContaining({
          _id: expect.any(String),
          oldEmail: expect.any(String),
          email: expect.any(String),
        }),
      })
    );
  });

  test("Edit Password - Success", async () => {
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

    const editPassword = await request(app)
      .patch("/user/update/password")
      .send({
        email: testUserCredentials.email,
        password: testUserCredentials.password,
        newPassword: testUserCredentials.newPassword,
      })
      .set("Cookie", [...loginRes.header["set-cookie"]])
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(editPassword.body).toEqual(
      expect.objectContaining({
        success: true,
        message: "Successfully changed password",
        payload: expect.objectContaining({
          _id: expect.any(String),
          email: expect.any(String),
        }),
      })
    );
  });

  test("Delete User - Success", async () => {
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

    const deleteUser = await request(app)
      .delete("/user/delete")
      .send({
        email: testUserCredentials.email,
        password: testUserCredentials.password,
        passwordConfirmation: testUserCredentials.passwordConfirmation,
      })
      .set("Cookie", [...loginRes.header["set-cookie"]])
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(deleteUser.body).toEqual(
      expect.objectContaining({
        success: true,
        message: "Deleted User",
      })
    );
  });
});

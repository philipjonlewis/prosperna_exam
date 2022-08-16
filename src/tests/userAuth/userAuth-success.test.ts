import request from "supertest";
import app from "../../app";
import { config } from "../../config";
import { describe, expect, test } from "vitest";
import UserAuth from "../../model/dbModel/userAuthDbModel";

import {
  signedRefreshToken,
  signedAccessToken,
} from "../../utils/cookieOptions";

import {
  userAuthSuccessTestUserCredentials as testUserCredentials,
  userAuthSuccessTestMail as testmail,
} from "../mock/mockTestingCredentials";

import {
  userAuthSignUpSuccessResponse,
  userAuthLogInSuccessResponse,
  userAuthlogOutSuccessResponse,
  userAuthVerifyUserSuccessResponse,
  userAuthUpdateEmailSuccessResponse,
  userAuthUpdatePasswordSuccessResponse,
  userAuthDeleteUserSuccessResponse,
} from "../../helpers/userAuthSuccessResponse";

describe("User Auth API - Success", () => {
  test("Sign Up", async () => {
    const res = await request(app)
      .post(`${config.URL}/user/signup`)
      .send({
        email: testmail.signup,
        password: testUserCredentials.password,
        passwordConfirmation: testUserCredentials.passwordConfirmation,
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body).toEqual(
      expect.objectContaining(
        await userAuthSignUpSuccessResponse(
          res.body.payload._id,
          testmail.signup
        )
      )
    );

    await UserAuth.deleteOne({ email: testmail.signup });
  });

  test("Log In", async () => {
    const newUser = new UserAuth({
      email: testmail.login,
      password: testUserCredentials.password,
      passwordConfirmation: testUserCredentials.passwordConfirmation,
    });

    const { _id, email } = newUser;

    const refreshToken = await signedRefreshToken(_id.toString(), email);
    const accessToken = await signedAccessToken(_id.toString(), email);

    newUser.refreshToken = refreshToken;
    newUser.accessToken = accessToken;

    await newUser.save();

    const res = await request(app)
      .post(`${config.URL}/user/login`)
      .send({
        email: testmail.login,
        password: testUserCredentials.password,
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(await res.body).toEqual(
      expect.objectContaining(
        await userAuthLogInSuccessResponse(res.body.payload._id, testmail.login)
      )
    );

    await UserAuth.deleteOne({ email: testmail.login });
  });

  test("Log Out", async () => {
    const newUser = new UserAuth({
      email: testmail.logout,
      password: testUserCredentials.password,
      passwordConfirmation: testUserCredentials.passwordConfirmation,
    });

    const { _id, email } = newUser;

    const refreshToken = await signedRefreshToken(_id.toString(), email);
    const accessToken = await signedAccessToken(_id.toString(), email);

    newUser.refreshToken = refreshToken;
    newUser.accessToken = accessToken;

    await newUser.save();

    const loginRes = await request(app).post(`${config.URL}/user/login`).send({
      email: testmail.logout,
      password: testUserCredentials.password,
    });

    const logoutRes = await request(app)
      .get(`${config.URL}/user/logout`)
      .set("Cookie", [...loginRes.header["set-cookie"]])
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(logoutRes.body).toEqual(
      expect.objectContaining(userAuthlogOutSuccessResponse)
    );

    await UserAuth.deleteOne({ email: testmail.logout });
  });

  test("Verify User", async () => {
    const newUser = new UserAuth({
      email: testmail.verify,
      password: testUserCredentials.password,
      passwordConfirmation: testUserCredentials.passwordConfirmation,
    });

    const { _id, email } = newUser;

    const refreshToken = await signedRefreshToken(_id.toString(), email);
    const accessToken = await signedAccessToken(_id.toString(), email);

    newUser.refreshToken = refreshToken;
    newUser.accessToken = accessToken;

    await newUser.save();

    const loginRes = await request(app).post(`${config.URL}/user/login`).send({
      email: testmail.verify,
      password: testUserCredentials.password,
    });

    const verifyUser = await request(app)
      .get(`${config.URL}/user/verify`)
      .set("Cookie", [...loginRes.header["set-cookie"]])
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(verifyUser.body).toEqual(
      expect.objectContaining(userAuthVerifyUserSuccessResponse)
    );

    await UserAuth.deleteOne({ email: testmail.verify });
  });

  test("Edit Email", async () => {
    const newUser = new UserAuth({
      email: testmail.editemail,
      password: testUserCredentials.password,
      passwordConfirmation: testUserCredentials.passwordConfirmation,
    });

    const { _id, email } = newUser;

    const refreshToken = await signedRefreshToken(_id.toString(), email);
    const accessToken = await signedAccessToken(_id.toString(), email);

    newUser.refreshToken = refreshToken;
    newUser.accessToken = accessToken;

    await newUser.save();

    const loginRes = await request(app).post(`${config.URL}/user/login`).send({
      email: testmail.editemail,
      password: testUserCredentials.password,
    });

    const editEmail = await request(app)
      .patch(`${config.URL}/user/update/email`)
      .send({
        email: testmail.editemail,
        newEmail: testmail.editemailnew,
        password: testUserCredentials.password,
      })
      .set("Cookie", [...loginRes.header["set-cookie"]])
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(editEmail.body).toEqual(
      expect.objectContaining(
        userAuthUpdateEmailSuccessResponse(
          loginRes.body.payload._id,
          testmail.editemail,
          testmail.editemailnew
        )
      )
    );

    await UserAuth.deleteOne({ email: testmail.editemail });
    await UserAuth.deleteOne({ email: testmail.editemailnew });
  });

  test("Edit Password", async () => {
    const newUser = new UserAuth({
      email: testmail.editpassword,
      password: testUserCredentials.password,
      passwordConfirmation: testUserCredentials.passwordConfirmation,
    });

    const { _id, email } = newUser;

    const refreshToken = await signedRefreshToken(_id.toString(), email);
    const accessToken = await signedAccessToken(_id.toString(), email);

    newUser.refreshToken = refreshToken;
    newUser.accessToken = accessToken;

    await newUser.save();

    const loginRes = await request(app).post(`${config.URL}/user/login`).send({
      email: testmail.editpassword,
      password: testUserCredentials.password,
    });

    const editPassword = await request(app)
      .patch(`${config.URL}/user/update/password`)
      .send({
        email: testmail.editpassword,
        password: testUserCredentials.password,
        newPassword: testUserCredentials.newPassword,
      })
      .set("Cookie", [...loginRes.header["set-cookie"]])
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(editPassword.body).toEqual(
      expect.objectContaining(
        userAuthUpdatePasswordSuccessResponse(
          loginRes.body.payload._id,
          testmail.editpassword
        )
      )
    );

    await UserAuth.deleteOne({ email: testmail.editpassword });
  });

  test("Delete User", async () => {
    const newUser = new UserAuth({
      email: testmail.deleteuser,
      password: testUserCredentials.password,
      passwordConfirmation: testUserCredentials.passwordConfirmation,
    });

    const { _id, email } = newUser;

    const refreshToken = await signedRefreshToken(_id.toString(), email);
    const accessToken = await signedAccessToken(_id.toString(), email);

    newUser.refreshToken = refreshToken;
    newUser.accessToken = accessToken;

    await newUser.save();

    const loginRes = await request(app).post(`${config.URL}/user/login`).send({
      email: testmail.deleteuser,
      password: testUserCredentials.password,
    });

    const deleteUser = await request(app)
      .delete(`${config.URL}/user/delete`)
      .send({
        email: testmail.deleteuser,
        password: testUserCredentials.password,
        passwordConfirmation: testUserCredentials.passwordConfirmation,
      })
      .set("Cookie", [...loginRes.header["set-cookie"]])
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(deleteUser.body).toEqual(
      expect.objectContaining(userAuthDeleteUserSuccessResponse)
    );

    await UserAuth.deleteOne({ email: testmail.deleteuser });
  });
});

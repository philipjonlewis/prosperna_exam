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
  email: "userauthfailurelogin",
  password: "SamplePassword",
  passwordConfirmation: "SamplePassword888!",
};
import {
  userAuthValidationError,
  userAuthenticationError,
  userControllerError,
} from "../../helpers/userAuthErrorResponse";

describe("User Auth API - Failure - Log In", () => {
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
      .post(`${config.URL}/user/login`)
      .send({
        email: testUserCredentials.email,
        password: testUserCredentials.password + "888!",
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(userAuthValidationError.error.code);

    expect(res.body).toEqual(expect.objectContaining(userAuthValidationError));
  });

  test("Invalid Password Format", async () => {
    const res = await request(app)
      .post(`${config.URL}/user/login`)
      .send({
        email: testUserCredentials.email + "@email.com",
        password: "SamplePassword777",
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(userAuthValidationError.error.code);

    expect(res.body).toEqual(expect.objectContaining(userAuthValidationError));
  });

  test("Invalid Password", async () => {
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
      .post(`${config.URL}/user/login`)
      .send({
        email: testUserCredentials.email + "@email.com",
        password: "PeoplePerson777!",
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(userControllerError.error.code);

    expect(res.body).toEqual(expect.objectContaining(userControllerError));
  });

  test("Non Existent User", async () => {
    const res = await request(app)
      .post(`${config.URL}/user/login`)
      .send({
        email: "anothertestemail@gmail.com",
        password: testUserCredentials.password + "888!",
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(userAuthenticationError.error.code);

    expect(res.body).toEqual(expect.objectContaining(userAuthenticationError));
  });
});

import request from "supertest";
import app from "../../app";
import bcrypt from "bcryptjs";

import {
  describe,
  expect,
  test,
  beforeAll,
  afterAll,
  afterEach,
  beforeEach,
} from "vitest";
// import bcryp
import UserAuth from "../../model/dbModel/userAuthDbModel";

import {
  signedRefreshToken,
  signedAccessToken,
} from "../../utils/cookieOptions";

const testUserCredentials = {
  email: "successuserauth@email.com",
  password: "SamplePassword888!",
  passwordConfirmation: "SamplePassword888!",
  newEmail: "userauthsuccessnewemail@test.com",
  newPassword: "PeoplePerson612!",
};

const testmail = {
  signup: "testsuccesssignup@email.com",
  login: "testsuccesslogin@email.com",
  logout: "testsuccesslogout@email.com",
  verify: "testsuccessverify@email.com",
  editemail: "testsuccesseditemail@email.com",
  editemailnew: "testsuccesseditemailnew@email.com",
  editpassword: "testsuccesseditpassword@email.com",
  deleteuser: "testsuccessdeleteuser@email.com",
};

describe("User Auth API - Success", () => {
  test("Sign Up", async () => {
    const res = await request(app)
      .post("/api_v1/user/signup")
      .send({
        email: testmail.signup,
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
      .post("/api_v1/user/login")
      .send({
        email: testmail.login,
        password: testUserCredentials.password,
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(await res.body).toEqual(
      expect.objectContaining({
        success: true,
        message: "Successfully logged in",
        payload: expect.objectContaining({
          _id: expect.any(String),
          email: expect.any(String),
        }),
      })
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

    const loginRes = await request(app).post("/api_v1/user/login").send({
      email: testmail.logout,
      password: testUserCredentials.password,
    });

    const logoutRes = await request(app)
      .get("/api_v1/user/logout")
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

    const loginRes = await request(app).post("/api_v1/user/login").send({
      email: testmail.verify,
      password: testUserCredentials.password,
    });

    const verifyUser = await request(app)
      .get("/api_v1/user/verify")
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

    const loginRes = await request(app).post("/api_v1/user/login").send({
      email: testmail.editemail,
      password: testUserCredentials.password,
    });

    const editEmail = await request(app)
      .patch("/api_v1/user/update/email")
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
      expect.objectContaining({
        success: true,
        message: "Successfully changed email - Please Log In Again",
        payload: expect.objectContaining({
          _id: expect.any(String),
          oldEmail: expect.any(String),
          email: expect.any(String),
        }),
      })
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

    const loginRes = await request(app).post("/api_v1/user/login").send({
      email: testmail.editpassword,
      password: testUserCredentials.password,
    });

    const editPassword = await request(app)
      .patch("/api_v1/user/update/password")
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
      expect.objectContaining({
        success: true,
        message: "Successfully changed password - Please Log In Again",
        payload: expect.objectContaining({
          _id: expect.any(String),
          email: expect.any(String),
        }),
      })
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

    const loginRes = await request(app).post("/api_v1/user/login").send({
      email: testmail.deleteuser,
      password: testUserCredentials.password,
    });

    const deleteUser = await request(app)
      .delete("/api_v1/user/delete")
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
      expect.objectContaining({
        success: true,
        message: "Deleted User",
      })
    );

    await UserAuth.deleteOne({ email: testmail.deleteuser });
  });
});

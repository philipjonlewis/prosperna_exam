
import jwt from "jsonwebtoken";

import UserAuth from "../../../model/dbModel/userAuthDbModel";

const refreshTokenHandler = async (user: any) => {
  const refreshToken = await jwt.sign(
    {
      refreshToken: await user._id,
    },
    process.env.AUTH_TOKEN_KEY as string,
    {
      issuer: await user._id,
      subject: await user.email,
      audience: "https://www.datetask.com",
      expiresIn: "672h",
      algorithm: "HS256",
    }
  );
  await UserAuth.findByIdAndUpdate(await user._id, {
    refreshTokens: [refreshToken],
  });

  return refreshToken;
};

const accessTokenHandler = async (idValue: any) => {
  const newAccessToken = jwt.sign({ access: await idValue }, await idValue, {
    issuer: await idValue,
    subject: await idValue,
    audience: "https://www.datetask.com",
    expiresIn: "1800000",
  });
  return newAccessToken;
};

export { refreshTokenHandler, accessTokenHandler };

import mongoose from "mongoose";

import userAuthSchema from "../dbSchema/userAuthSchema";

const UserAuth = mongoose.model("auth", userAuthSchema);

export default UserAuth;

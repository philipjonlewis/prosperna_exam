import { Router } from "express";
import userAgent from "express-useragent";

import { signUpUserDataSanitizer } from "../middleware/sanitization/userAuthSanitizer";
import { signUpUserDataValidator } from "../middleware/validation/userAuthValidator";
import { signUpAuthenticator } from "../middleware/authentication/userAuthAuthentication";
import { signUpUserDataController } from "../controllers/userAuthController";

const router = Router();
router.use(userAgent.express());

//SignUp
//LogIn
//Change Email
//Change Password
//Delete User

//Sanitize
//Validate
//Authenticate
//Controller

router
  .route("/signup")
  .post([
    signUpUserDataSanitizer,
    signUpUserDataValidator,
    signUpAuthenticator,
    signUpUserDataController,
  ]);

export default router;

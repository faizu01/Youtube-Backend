import { Router } from "express";
import registerUser from "../controllers/user.controller.js";
import { upload } from "../middlewares/multur.middlewares.js";
const router = Router();

router.route("/register").post(
  //middleware
  upload.fields([
    {
      name: "avatar",
      maxCount: 1
    },
    {
      name: "coverImage",
      maxCount: 1
    }
  ]),

  //function/controller
  registerUser
);

export default router;

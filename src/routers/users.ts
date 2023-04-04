import express from "express";

import { createUser, setProfilePicture } from "../controllers/users.js";
import { isAuthenticated, multerUpload } from "../middlewares/index.js";

export default (router: express.Router) => {
  router.post("/createUser", isAuthenticated, createUser);
  router.post(
    "/setProfilePicture",
    isAuthenticated,
    multerUpload,
    setProfilePicture
  );
};

import express from "express";

import { createUser } from "../controllers/users";
import { isAuthenticated } from "../middlewares";

export default (router: express.Router) => {
  router.post("/createUser", isAuthenticated, createUser);
};

import express from "express";
import users from "./users.js";
import chatbots from "./chatbots.js";

const router = express.Router();

export default (): express.Router => {
  chatbots(router);
  users(router);
  return router;
};

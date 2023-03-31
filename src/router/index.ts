import express from "express";
import users from "./users";
import chatbots from "./chatbots";

const router = express.Router();

export default (): express.Router => {
  users(router);
  chatbots(router);
  return router;
};

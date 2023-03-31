import express from "express";

import { createChatbot } from "../controllers/chatbots";
import { isAuthenticated } from "../middlewares";

export default (router: express.Router) => {
  router.post("/createChatbot", createChatbot);
};

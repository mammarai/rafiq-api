import express from "express";

import { createChatbot } from "../controllers/chatbots.js";

export default (router: express.Router) => {
  router.post("/creatChatbot", createChatbot);
};

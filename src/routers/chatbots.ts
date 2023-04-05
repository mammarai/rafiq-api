import express from "express";

import { createChatbot } from "../controllers/chatbots.js";
import { isAuthenticated, multerUpload } from "../middlewares/index.js";

export default (router: express.Router) => {
  router.post("/createChatbot", multerUpload, createChatbot);
};

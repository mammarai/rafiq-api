import express from "express";

import { createChatbot } from "../controllers/chatbots";
import { isAuthenticated, multerUpload } from "../middlewares";

export default (router: express.Router) => {
  router.post("/createChatbot", multerUpload, createChatbot);
};

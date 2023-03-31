import express from "express";
import { get } from "lodash";

import { newChatbot } from "../db/chatbots";

export const createChatbot = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { name, documents } = req.body;
    if (!name || !documents) {
      return res.status(400).send({ error: "missing required fields." });
    }
    const firebaseUser = get(req, "user", null);
    if (!firebaseUser) {
      return res.sendStatus(401);
    }
    const id = firebaseUser.uid as String;
    // const chatbot = await newChatbot({
    //   owner: id,
    //   name,

    // });
  } catch (error) {
    return res.status(400).send(error);
  }
};

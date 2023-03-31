import express from "express";
import { get } from "lodash";
import { newUser } from "../db/users";

export const createUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const firebaseUser = get(req, "user", null);
    if (!firebaseUser) {
      return res.sendStatus(401);
    }
    const id = firebaseUser.uid;
    const user = await newUser({ _id: id });
    return res.status(201).json(user);
  } catch (error) {
    return res.status(400).send(error);
  }
};

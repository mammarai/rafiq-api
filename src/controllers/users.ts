import express from "express";
import { get, identity } from "lodash";
import { getUserById, newUser } from "../db/users";

export const createUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const id = (get(req, "user.uid") as string).toString();
    const existingUser = await getUserById(id);
    if (existingUser) {
      return res.status(400).send({ error: "User already exists." });
    }
    const user = await newUser({ _id: id });
    return res.status(201).json(user);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

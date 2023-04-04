import express from "express";
import lodashPkg from "lodash";
const { merge, get } = lodashPkg;
import { getUserById, newUser } from "../db/users.js";

export const createUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const id = (get(req, "user.uid") as unknown as string).toString();
    const existingUser = await getUserById(id);
    if (existingUser === undefined) {
      return res.status(400).send({ error: "User already exists." });
    }
    const user = await newUser({ _id: id });
    return res.status(201).json(user);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
export const setProfilePicture = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { img } = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };
    if (!img) {
      return res.status(400).send({ error: "No image provided" });
    }
    return res.status(200).send(`/uploads/${img[0].filename}`);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

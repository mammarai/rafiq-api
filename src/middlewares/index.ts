import express from "express";
import { set } from "lodash";
import admin from "../modules/admin";

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const idToken = req.headers.authorization;
    if (!idToken) {
      return res.sendStatus(403);
    }
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    set(req, "user", decodedToken);
    next();
  } catch (error) {
    return res.sendStatus(401);
  }
};

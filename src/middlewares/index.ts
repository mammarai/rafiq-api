import express from "express";
import multer from "multer";
import { merge } from "lodash";
import admin from "../modules/admin";

const upload = multer();

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
    merge(req, { user: decodedToken });
    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(401);
  }
};

export const multerUpload = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    upload.fields([
      { name: "pdf", maxCount: 1 },
      // { name: "doc", maxCount: 10 },
      // { name: "docx", maxCount: 1 },
      // { name: "csv", maxCount: 1 },
      { name: "urls", maxCount: 1 },
    ])(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        throw new Error(err.message);
      } else if (err) {
        throw new Error("Internal server error");
      }
      next();
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

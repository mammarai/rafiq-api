import express from "express";
import multer from "multer";
import lodashPkg from "lodash";
const { merge, get } = lodashPkg;
import admin from "../modules/admin.js";
import path, { dirname } from "path";
import { v4 as uuidv4 } from "uuid";

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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(dirname("./"), "public"));
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + uuidv4();
    cb(null, file.fieldname + "-" + uniqueSuffix + extension);
  },
});

const fileFilter = (
  req: express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimeTypes = [
    "application/pdf",
    "text/csv",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "image/jpeg",
    "image/png",
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("File type not allowed."));
  }
};

const upload = multer({
  storage,
  fileFilter,
});

export const multerUpload = upload.fields([
  { name: "pdf", maxCount: 5 },
  { name: "csv", maxCount: 5 },
  { name: "xlsx", maxCount: 5 },
  { name: "doc", maxCount: 5 },
  { name: "url", maxCount: 1 },
  { name: "text", maxCount: 5 },
  { name: "img", maxCount: 1 },
]);
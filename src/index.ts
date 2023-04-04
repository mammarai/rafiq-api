import express from "express";
import http from "http";
import bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import * as dotenv from "dotenv";
import path, { dirname } from "path";
import mongoose from "mongoose";
import { isAuthenticated } from "./middlewares/index.js";
import router from "./routers/index.js";

dotenv.config();

const app = express();

app.use(
  cors({
    credentials: true,
  })
);
app.use(compression());
app.use(bodyParser.json());
app.use("/uploads", isAuthenticated);
app.use("/uploads", express.static(path.resolve(dirname("./"), "public")));

const server = http.createServer(app);

server.listen(8080, () => {
  console.log("Server running on http://localhost:8080/");
});

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGO_URL! as string);
mongoose.connection.on("error", (error: Error) => {
  console.log(error);
});

app.use("/", router());
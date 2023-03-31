import express from "express";
import http from "http";
import bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import router from "./router";

dotenv.config();

const app = express();

app.use(
  cors({
    credentials: true,
  })
);
app.use(compression());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(8080, () => {
  console.log("Server running on http://localhost:8080/");
});

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGO_URL);
mongoose.connection.on("error", (error: Error) => {
  console.log(error);
});

app.use("/", router());
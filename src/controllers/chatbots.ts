import express from "express";
import { get } from "lodash";
import { Crawler, Page } from "../helpers/crawler";
import { newChatbot } from "../db/chatbots";
import pdfReader from "../helpers/pdfReader";

export const createChatbot = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    // const { name, documents } = req.body;
    // if (!name || !documents) {
    //   return res.status(400).send({ error: "missing required fields." });
    // }
    const pdfFile =
      (req.files as { [fieldname: string]: Express.Multer.File[] })[
        "pdf"
      ]?.[0];
      const urls = req.body.urls?.split(",");
    // const id = (get(req, "user.uid") as string).toString();
    // const crawler = new Crawler(documents, 2, 200);
    // const pages = (await crawler.start()) as Page[];
    //const text = await pdfReader.getPDFText(pdfFile);
    return res.status(200).send();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

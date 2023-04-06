import express from "express";
import lodashPkg from "lodash";
const { merge, get } = lodashPkg;
import { Crawler } from "../helpers/crawler.js";
import { Document } from "langchain/document";
import { PDFLoader } from "langchain/document_loaders";
import { CSVLoader } from "langchain/document_loaders";
import { DocxLoader } from "langchain/document_loaders";
import { TextLoader } from "langchain/document_loaders";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings";
import { PineconeStore } from "langchain/vectorstores";
import pinecone from "../modules/pinecone.js";
import { XLSXLoader } from "../helpers/xlsxLoader.js";
import * as dotenv from "dotenv";
dotenv.config();

const embeddings = new OpenAIEmbeddings();

const upsertFile = async (
  file: Express.Multer.File,
  pineconeIndex: any,
  textSplitter: { splitDocuments: (arg0: Document[]) => any },
  namespace: string,
  type: number
) => {
  let loader: any;

  switch (type) {
    case 1:
      loader = new PDFLoader(file.path);
      break;
    case 2:
      loader = new CSVLoader(file.path);
      break;
    case 3:
      loader = new DocxLoader(file.path);
      break;
    case 4:
      loader = new TextLoader(file.path);
      break;
  }

  const rawDocs = await loader.load();
  const docs = await textSplitter.splitDocuments(rawDocs);
  await PineconeStore.fromDocuments(docs, embeddings, {
    pineconeIndex: pineconeIndex,
    namespace: namespace,
    textKey: "text",
  });
};

export const createChatbot = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { pdf, csv, docx, doc, txt, xlsx } = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };
    const urls = req.body.urls?.split(",");
    if (!pdf && !csv && !txt && !doc && !docx && !urls && !xlsx) {
      return res.status(400).json({ error: "No data source given." });
    }
    const loaded = new CSVLoader(xlsx[0].path);
    const docs = await loaded.load();
    return res.send(docs);
    // const pineconeIndex = pinecone.Index(process.env.PINECONE_ENGLISH_INDEX!);
    // const textSplitter = new RecursiveCharacterTextSplitter({
    //   chunkSize: 1000,
    //   chunkOverlap: 200,
    // });
    // const namespace = "chatbot-namespace";
    // if (urls) {
    //   const crawler = new Crawler(urls, 100, 200);
    //   const rawDocs = (await crawler.start()) as Document[];
    //   const docs = await textSplitter.splitDocuments(rawDocs);
    //   await PineconeStore.fromDocuments(docs, embeddings, {
    //     pineconeIndex: pineconeIndex,
    //     namespace: namespace,
    //     textKey: "text",
    //   });
    // }
    // if (pdf) {
    //   pdf.forEach(async (file) => {
    //     await upsertFile(file, pineconeIndex, textSplitter, namespace, 1);
    //   });
    // }
    // if (csv) {
    //   csv.forEach(async (file) => {
    //     await upsertFile(file, pineconeIndex, textSplitter, namespace, 2);
    //   });
    // }
    // if (doc) {
    //   doc.forEach(async (file) => {
    //     await upsertFile(file, pineconeIndex, textSplitter, namespace, 3);
    //   });
    // }
    // if (docx) {
    //   docx.forEach(async (file) => {
    //     await upsertFile(file, pineconeIndex, textSplitter, namespace, 3);
    //   });
    // }
    // if (txt) {
    //   txt.forEach(async (file) => {
    //     await upsertFile(file, pineconeIndex, textSplitter, namespace, 4);
    //   });
    // }
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

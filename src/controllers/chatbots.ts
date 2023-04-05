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
import * as dotenv from "dotenv";
dotenv.config();

const embeddings = new OpenAIEmbeddings();

export const createChatbot = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { pdf, csv, docx, doc, txt } = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };
    const urls = req.body.urls?.split(",");
    if (!pdf && !csv && !txt && !doc && !docx && !urls) {
      return res.status(400).json({ error: "No data source given." });
    }
    const pineconeIndex = pinecone.Index(process.env.PINECONE_ENGLISH_INDEX!);
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const namespace = "chatbot-namespace";
    if (urls) {
      const crawler = new Crawler(urls, 400, 200);
      const rawDocs = (await crawler.start()) as Document[];
      const docs = await textSplitter.splitDocuments(rawDocs);
      await PineconeStore.fromDocuments(docs, embeddings, {
        pineconeIndex: pineconeIndex,
        namespace: namespace,
        textKey: "text",
      });
    }
    if (pdf) {
      pdf.forEach(async (file) => {
        const loader = new PDFLoader(file.path);
        const rawDocs = await loader.load();
        const docs = await textSplitter.splitDocuments(rawDocs);
        await PineconeStore.fromDocuments(docs, embeddings, {
          pineconeIndex: pineconeIndex,
          namespace: namespace,
          textKey: "text",
        });
      });
    }
    if (csv) {
      csv.forEach(async (file) => {
        const loader = new CSVLoader(file.path);
        const rawDocs = await loader.load();
        const docs = await textSplitter.splitDocuments(rawDocs);
        await PineconeStore.fromDocuments(docs, embeddings, {
          pineconeIndex: pineconeIndex,
          namespace: namespace,
          textKey: "text",
        });
      });
    }
    if (doc) {
      doc.forEach(async (file) => {
        const loader = new DocxLoader(file.path);
        const rawDocs = await loader.load();
        const docs = await textSplitter.splitDocuments(rawDocs);
        await PineconeStore.fromDocuments(docs, embeddings, {
          pineconeIndex: pineconeIndex,
          namespace: namespace,
          textKey: "text",
        });
      });
    }
    if (docx) {
      docx.forEach(async (file) => {
        const loader = new DocxLoader(file.path);
        const rawDocs = await loader.load();
        const docs = await textSplitter.splitDocuments(rawDocs);
        await PineconeStore.fromDocuments(docs, embeddings, {
          pineconeIndex: pineconeIndex,
          namespace: namespace,
          textKey: "text",
        });
      });
    }
    if (docx) {
      docx.forEach(async (file) => {
        const loader = new TextLoader(file.path);
        const rawDocs = await loader.load();
        const docs = await textSplitter.splitDocuments(rawDocs);
        await PineconeStore.fromDocuments(docs, embeddings, {
          pineconeIndex: pineconeIndex,
          namespace: namespace,
          textKey: "text",
        });
      });
    }
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
  


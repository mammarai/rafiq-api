import express from "express";
import lodashPkg from "lodash";
const { merge, get } = lodashPkg;

export const createChatbot = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { pdf, csv, xlsx, docx, doc } = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };
    const urls = req.body.urls?.split(",");
    if (!pdf && !csv && !xlsx && !doc && !docx && !urls) {
      return res.status(400).json({ error: "No data source given." });
    }
    // if (urls) {
    //   const crawler = new Crawler(urls, 2, 200);
    //   const pages = (await crawler.start()) as Page[];
    //   if (pages) {
    //   }
    // }

    return res.status(200).json();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
  


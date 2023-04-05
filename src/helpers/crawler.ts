//@ts-ignore
import Spider from "node-spider";
//@ts-ignore
import TurndownService from "turndown";
import cheerio from "cheerio";
import { Document } from "langchain/document";

const turndownService = new TurndownService();

class Crawler {
  documents: Document[] = [];
  limit: number = 1000;
  urls: string[] = [];
  spider: Spider | null = {};
  count: number = 0;
  textLengthMinimum: number = 200;

  constructor(
    urls: string[],
    limit: number = 1000,
    textLengthMinimum: number = 200
  ) {
    this.urls = urls;
    this.limit = limit;
    this.textLengthMinimum = textLengthMinimum;

    this.count = 0;
    this.documents = [];
    this.spider = {};
  }

  handleRequest = (doc: any) => {
    const $ = cheerio.load(doc.res.body);
    //Remove obviously superfulous elements
    $("script").remove();
    $("header").remove();
    $("nav").remove();
    const title = $("title").text() || "";
    const html = $("body").html();
    const text = turndownService.turndown(html);

    const document: Document = new Document({
      pageContent: text,
      metadata: { title: title, source: doc.url },
    });
    if (text.length > this.textLengthMinimum) {
      this.documents.push(document);
    }

    doc.$("a").each((i: number, elem: any) => {
      var href = doc.$(elem).attr("href")?.split("#")[0];
      var url = href && doc.resolve(href);
      // crawl more
      if (
        url &&
        this.urls.some((u) => url.includes(u)) &&
        this.count < this.limit
      ) {
        this.spider.queue(url, this.handleRequest);
        this.count = this.count + 1;
      }
    });
  };

  start = async () => {
    this.documents = [];
    return new Promise((resolve, reject) => {
      this.spider = new Spider({
        concurrent: 5,
        delay: 0,
        allowDuplicates: false,
        catchErrors: true,
        addReferrer: false,
        xhr: false,
        keepAlive: false,
        error: (err: any, url: string) => {
          console.log(err, url);
          reject(err);
        },
        // Called when there are no more requests
        done: () => {
          resolve(this.documents);
        },
        headers: { "user-agent": "node-spider" },
        encoding: "utf8",
      });
      this.urls.forEach((url) => {
        this.spider.queue(url, this.handleRequest);
      });
    });
  };
}

export { Crawler };

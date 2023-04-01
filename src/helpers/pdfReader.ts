import * as pdfjslib from "pdfjs-dist";
import { TextItem } from "pdfjs-dist/types/src/display/api";

export default class Pdf {
  public static async getPageText(pdf: any, pageNo: number) {
    const page = await pdf.getPage(pageNo);
    const tokenizedText = await page.getTextContent();
    const pageText = tokenizedText.items
      .map((token: TextItem) => token.str)
      .join("");
    return pageText;
  }

  public static async getPDFText(source: Express.Multer.File): Promise<string> {
    const fileArrayBuffer = await source.buffer;
    const fileUint8Array = new Uint8Array(fileArrayBuffer);
    const pdf = await pdfjslib.getDocument(fileUint8Array).promise;
    const maxPages = pdf.numPages;
    const pageTextPromises = [];
    for (let pageNo = 1; pageNo <= maxPages; pageNo += 1) {
      pageTextPromises.push(Pdf.getPageText(pdf, pageNo));
    }
    const pageTexts = await Promise.all(pageTextPromises);
    return pageTexts.join(" ");
  }
}

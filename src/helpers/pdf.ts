import pdf from "pdf-parse";

export const extractTextFromPDF = async (source: Express.Multer.File) => {
  const fileArrayBuffer = await source.buffer;
  const data = await pdf(fileArrayBuffer);
  return data.text;
};

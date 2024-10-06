import { STORAGE_BUCKET_NAME } from "../config";
import { CSVRow } from "../types";
import { Storage } from "@google-cloud/storage";
import csv from "csv-parser";
import { Readable } from "stream";
import logger from "../logger"

export const readCsvFile = async (filePath: string, storageBucketName?: string): Promise<CSVRow[]> => {
  const storage = new Storage();

  const results: Array<CSVRow> = [];
  const fileContents = await storage
    .bucket(storageBucketName ?? STORAGE_BUCKET_NAME)
    .file(filePath)
    .download();
  const [file] = fileContents;
  const stream = Readable.from(file);
  return new Promise((resolve, reject) => {
    stream
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => {
        logger.info("CSV file successfully processed");
        resolve(results);
      })
      .on("error", (error) => reject(error));
  });
};

import { Storage } from "@google-cloud/storage";
import { STORAGE_BUCKET_NAME } from "../config";
import { isEmpty } from "lodash";

const b64creds = process.env.GOOGLE_APPLICATION_CREDENTIALS ?? "";
if (isEmpty(b64creds)) {
  throw new Error(
    "GOOGLE_APPLICATION_CREDENTIALS env var not set. Please convert a JSON key to base64 and set it as an environment variable in the .env file."
  );
}

const credentials = JSON.parse(Buffer.from(b64creds, "base64").toString());

export async function uploadFile(
  fileName: string,
  pathwayDefinitionId: string
) {
  const storage = new Storage({ credentials });
  const file = storage
    .bucket(STORAGE_BUCKET_NAME)
    .file(`${pathwayDefinitionId}/${fileName.split("/").pop()}`);
  await storage.bucket(STORAGE_BUCKET_NAME).upload(fileName, {
    destination: file,
  });
  console.log(`${fileName} uploaded to ${STORAGE_BUCKET_NAME}.`);
}

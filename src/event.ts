import { CloudEvent } from "@google-cloud/functions-framework";
import { ProcessingStatus } from "./types";
import { type File, Storage } from "@google-cloud/storage";
import { STORAGE_BUCKET_NAME } from "./config";

export function validateEvent(cloudEvent: CloudEvent<File>) {
  /**
   * -------------------------------------------------
   * Initial validation
   */
  const { data: file, ...rest } = cloudEvent;
  console.log(`Received Event: ${JSON.stringify(rest)}`);
  if (!file) {
    console.warn("No file provided");
    return {};
  }
  const { pathwayDefinitionId, fileName } = validateFile(file);
  if (Object.values(ProcessingStatus).includes(fileName as ProcessingStatus)) {
    console.log("file already processed");
    return {};
  }
  if (!pathwayDefinitionId || !fileName) {
    console.error("Invalid file name", file.name);
    return {};
  }
  /**
   * End initial validation
   * -------------------------------------------------
   */
  return {
    file,
    pathwayDefinitionId,
  };
}

export function validateFile(file: File): {
  pathwayDefinitionId: string;
  fileName: string;
} {
  const [pathwayDefinitionId, fileName] = file.name.split("/");

  console.log({
    message: "Examining file for pathway definition ID",
    fileOrFolder: fileName,
    pathwayDefinitionId,
  });
  return {
    pathwayDefinitionId,
    fileName,
  };
}

export function moveFileWithStatus(status: ProcessingStatus, file: File) {
  const { pathwayDefinitionId, fileName } = validateFile(file);
  return new Storage()
    .bucket(STORAGE_BUCKET_NAME)
    .file(file.name)
    .move(
      `${pathwayDefinitionId}/${status}/${new Date().valueOf()}_${fileName}`
    );
}

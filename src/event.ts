import { CloudEvent } from "@google-cloud/functions-framework";
import { ProcessingStatus } from "./types";
import { type File, Storage } from "@google-cloud/storage";
import { STORAGE_BUCKET_NAME } from "./config";
import logger from './logger'
export function validateEvent(cloudEvent: CloudEvent<File>) {
  /**
   * -------------------------------------------------
   * Initial validation
   */
  const { data: file, ...rest } = cloudEvent;
  logger.debug(`Received Event: ${JSON.stringify(rest)}`);
  if (!file) {
    logger.warn("No file provided");
    return {};
  }
  const { pathwayDefinitionId, fileName } = validateFile(file);
  if (Object.values(ProcessingStatus).includes(fileName as ProcessingStatus)) {
    logger.debug("file already processed");
    return {};
  }
  if (!pathwayDefinitionId || !fileName) {
    logger.error({ message: "Invalid file name", fileName: file.name});
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

  logger.info({
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

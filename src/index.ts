import { cloudEvent, type CloudEvent } from "@google-cloud/functions-framework";
import { type File } from "@google-cloud/storage";
import { readCsvFile } from "./csv";
import { AwellClient } from "./awell";
import { PatientEnrollment } from "./PatientEnrollment";
import { ProcessingStatus } from "./types";
import { validateEvent, moveFileWithStatus } from "./event";
import { AWELL_CONFIG, CLOUD_EVENT_NAME } from "./config";
import logger from "./logger";

// Register a CloudEvent callback with the Functions Framework that will
// be triggered by Cloud Storage.
cloudEvent(CLOUD_EVENT_NAME, async (cloudEvent: CloudEvent<File>) => {
  const { file, pathwayDefinitionId } = validateEvent(cloudEvent);
  if (!file || !pathwayDefinitionId) {
    return;
  }

  const client = new AwellClient(AWELL_CONFIG);
  try {
    const publishedCareflow = await client.getPublishedCareflow(
      pathwayDefinitionId
    );
    const rows = await readCsvFile(file.name);
    for await (const _row of rows) {
      try {
        const patientToEnroll = new PatientEnrollment(
          _row,
          publishedCareflow,
          client
        );
        await patientToEnroll.syncPatient();
        await patientToEnroll.enrollPatient();
        await Promise.resolve(setTimeout(() => {}, 100));
      } catch (err) {
        logger.error({ message: "Error when processing row", err, _row });
      }
    }
    await moveFileWithStatus(ProcessingStatus.SUCCESS, file);
  } catch (err) {
    logger.error({ message: "Error when processing file", err, file });
    await moveFileWithStatus(ProcessingStatus.FAILED, file);
  }
});

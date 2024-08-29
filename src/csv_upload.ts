import "./script/command";
import { uploadFile, getCareflowsForSelect, inquirerPrompt } from "./script";
import logger from './logger'

async function main() {
  const careflows = await getCareflowsForSelect();
  const { fileName, pathwayDefinitionId } = await inquirerPrompt(careflows);
  if (pathwayDefinitionId === "-1") {
    logger.info("Exiting...");
    return;
  }
  await uploadFile(fileName, pathwayDefinitionId);
  logger.info("Complete");
}

void main()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    logger.error(err);
    process.exit(1);
  });

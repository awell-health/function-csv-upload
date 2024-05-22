import "./script/command";
import { uploadFile, getCareflowsForSelect, inquirerPrompt } from "./script";

async function main() {
  const careflows = await getCareflowsForSelect();
  const { fileName, pathwayDefinitionId } = await inquirerPrompt(careflows);
  if (pathwayDefinitionId === "-1") {
    console.log("Exiting...");
    return;
  }
  await uploadFile(fileName, pathwayDefinitionId);
  console.log("Complete");
}

void main()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

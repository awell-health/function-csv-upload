import { select, input } from "@inquirer/prompts";

export const inquirerPrompt = async (
  careflows: { name: string; value: string }[]
) => {
  careflows.push({ name: "--- EXIT ---", value: "-1" });
  const pathwayDefinitionId = await select({
    message: "Please select a care flow",
    choices: careflows,
    loop: false,
  });
  if (pathwayDefinitionId === "-1") {
    return { fileName: "", pathwayDefinitionId: "-1" };
  }
  const fileName = await input({
    message: "Please provide the name of the CSV",
  });
  return { fileName, pathwayDefinitionId };
};

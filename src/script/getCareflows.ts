import { AwellClient } from "../awell";
import { AWELL_CONFIG } from "../config";

export const getCareflowsForSelect = async () => {
  const awell = new AwellClient(AWELL_CONFIG);
  const pathwayDefinitions = await awell.sdk.GetPublishedPathwayDefinitions();
  const careflows =
    pathwayDefinitions.data.publishedPathwayDefinitions
      .publishedPathwayDefinitions;
  return careflows.map((pd) => {
    return {
      name: `${pd.title} - ${pd.id}`,
      value: pd.id,
    };
  });
};

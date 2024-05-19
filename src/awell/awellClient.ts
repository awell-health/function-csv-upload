import { GraphQLClient } from "graphql-request";
import { getSdk, PublishedPathwayDefinition } from "./graphql-codegen/sdk";

export type CareflowDefinition = Omit<
  PublishedPathwayDefinition,
  "dataPointDefinitions"
>;

export class AwellClient {
  readonly apiUrl: string;
  readonly apiKey: string;
  private readonly client: GraphQLClient;
  readonly sdk: ReturnType<typeof getSdk>;

  constructor(opts: { apiUrl: string; apiKey: string }) {
    this.apiUrl = opts.apiUrl;
    this.apiKey = opts.apiKey;

    const client = new GraphQLClient(this.apiUrl, {
      headers: {
        apikey: this.apiKey,
      },
    });

    this.client = client;

    this.sdk = getSdk(this.client);
  }

  async getPublishedCareflow(
    pathwayDefinitionId: string
  ): Promise<CareflowDefinition> {
    /**
     * Get all published pathway definitions
     *
     * We're going to use these published pathway definitions to get the baseline data points
     * as well as validate the pathway definition ID
     */
    const resp = await this.sdk.GetPublishedPathwayDefinitions();
    const publishedPathway: CareflowDefinition | undefined = (
      resp?.data?.publishedPathwayDefinitions?.publishedPathwayDefinitions ?? []
    ).find((p) => p.id === pathwayDefinitionId);

    if (!publishedPathway) {
      throw new Error(
        `Pathway definition ID, ${pathwayDefinitionId}, not found`
      );
    }
    return publishedPathway;
  }
}

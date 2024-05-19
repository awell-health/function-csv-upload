import type { CodegenConfig } from "@graphql-codegen/cli";
import "dotenv/config";

const apiUrl = process.env.AWELL_API_URL;
const apiKey = process.env.AWELL_API_KEY;

const config: CodegenConfig = {
  overwrite: true,
  schema: [
    {
      // @ts-expect-error Not sure what the issue is here
      [apiUrl]: {
        headers: {
          apiKey,
        },
      },
    },
  ],
  generates: {
    "src/awell/graphql-codegen/sdk.ts": {
      documents: "src/awell/graphql-codegen/graphql/*.graphql",
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-graphql-request",
      ],
      config: {
        rawRequest: true,
      },
      overwrite: true,
    },
  },
};
export default config;

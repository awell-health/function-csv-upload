import { isEmpty } from "lodash";

export const AWELL_CONFIG = {
  apiKey: process.env.AWELL_API_KEY ?? "",
  apiUrl: process.env.AWELL_API_URL ?? "",
};
if (isEmpty(AWELL_CONFIG.apiKey) || isEmpty(AWELL_CONFIG.apiUrl)) {
  throw new Error("AWELL_API_KEY and AWELL_API_URL are required env vars");
}

export const IDENTIFIER_SYSTEM = process.env.IDENTIFIER_SYSTEM ?? "";
if (isEmpty(IDENTIFIER_SYSTEM)) {
  throw new Error("IDENTIFIER_SYSTEM is a required env var");
}

export const STORAGE_BUCKET_NAME = process.env.STORAGE_BUCKET_NAME ?? "";
if (isEmpty(STORAGE_BUCKET_NAME)) {
  throw new Error("STORAGE_BUCKET_NAME is a required env var");
}

export const CLOUD_EVENT_NAME = process.env.CLOUD_EVENT_NAME ?? "";
if (isEmpty(CLOUD_EVENT_NAME)) {
  throw new Error("CLOUD_EVENT_NAME is a required env var");
}

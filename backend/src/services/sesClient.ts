// lib/sesClient.ts
import { SESClient } from "@aws-sdk/client-ses";
import { sesConfig } from "../config/ses.config";

const REGION = "us-east-1";
 export const sesClient = new SESClient({
  region: sesConfig.region,
  credentials: {
    accessKeyId: sesConfig.accessKeyId,
    secretAccessKey: sesConfig.secretAccessKey,
  },
});


import { getEnvVar } from "../libs/getEnvVar";



interface ISesConfig {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
}


export const sesConfig: ISesConfig = {
  accessKeyId: getEnvVar("AWS_ACCESS_KEY"),
  secretAccessKey: getEnvVar("AWS_SECRET_ACCESS_KEY"),
  region: getEnvVar("AWS_SES_REGION"),
};

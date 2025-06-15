function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

interface ISesConfig {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
}

const sesConfig: ISesConfig = {
  accessKeyId: getEnvVar(process.env.AWS_ACCESS_KEY || ""),
  secretAccessKey: getEnvVar(process.env.AWS_SECRET_ACCESS_KEY || ""),
  region: getEnvVar(process.env.AWS_SES_REGION || ""),
};

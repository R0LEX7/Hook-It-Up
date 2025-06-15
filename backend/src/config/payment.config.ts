import { getEnvVar } from "../libs/getEnvVar";

interface IPaymentConfig {
  key_id: string;
  key_secret: string;
}


export const paymentConfig : IPaymentConfig = {
 key_id : getEnvVar("PAYMENT_API_KEY"),
key_secret : getEnvVar("PAYMENT_API_SECRET")
}

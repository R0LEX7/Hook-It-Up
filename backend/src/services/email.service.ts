import { SendEmailCommand } from "@aws-sdk/client-ses";
import { sesClient } from "./sesClient";


interface EmailParams {
  to: string;
  from: string;
  subject: string;
  htmlBody: string;
  textBody?: string;
  cc?: string[];
  replyTo?: string[];
}

export const createSendEmailCommand = ({
  to,
  from,
  subject,
  htmlBody,
  textBody = "This email requires an HTML-compatible viewer.",
  cc = [],
  replyTo = [],
}: EmailParams) => {
  return new SendEmailCommand({
    Destination: {
      ToAddresses: [to],
      CcAddresses: cc,
    },
    Message: {
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: htmlBody,
        },
        Text: {
          Charset: "UTF-8",
          Data: textBody,
        },
      },
    },
    Source: from,
    ReplyToAddresses: replyTo,
  });
};


export const run = async () => {
  const sendEmailCommand = createSendEmailCommand({
    to :"himanshugola1111@gmail.com",
    from :"himanshugola.dev@gmail.com",
    subject :"test subject",
    htmlBody :"<h1>Hello world!!!</h1>"}
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

// snippet-end:[ses.JavaScript.email.sendEmailV3]

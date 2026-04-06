# Episode-04 - Sending Emails using Amazon SES

Go to AWS or search Amazon SES on google
IAM -> users -> create new user -> ses-user
Permission option -> attach policies directly -> search -> amazonses -> select full access -> done

search ses
get setup page -> create identity -> identity type (domain) devtinder.in -> easy dkim -> done
copy cname
//do same for email
get setup page -> create identity -> email (domain) ds3396312@gmail.com

verification by ses to check domain is mine
open cloudfare
Dns records -> add records -> create new cname for all cname give in ses and turn off proxy
Identity status -> verified in ses
get setup page -> request production acceess -> select transaction and add domain

Iam -> ses-user -> create access key -> select other -> copy access key

Backend
.env
AWS_ACCESS_KEY
AWS_SES_SECRET

Google - aws ses nodejs docs
[copy sending an email code](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/javascript_ses_code_examples.html) -> sendEmail
https://github.com/awsdocs/aws-doc-sdk-examples/blob/main/javascriptv3/example_code/ses/src/ses_sendemail.js#L16

```js
//sesClient.js
const { SESClient } = require("@aws-sdk/client-ses");
//set region as per EC2
const REGION = "us-east-1";

const sesClient = new SESClient({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SES_SECRET,
  },
});
module.export = { sesClient };
```

```js
//sendEmail.js
const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient.js");

const createSendEmailCommand = (toAddress, fromAddress, subject, body) => {
  return new SendEmailCommand({
    Destination: {
      CcAddresses: [],
      ToAddresses: [toAddress],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<h1>${body}</h1>`,
        },
        Text: {
          Charset: "UTF-8",
          Data: "<h1>This is the text format email</h1>",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [],
  });
};

const run = async (subject, body) => {
  const sendEmailCommand = createSendEmailCommand(
    //send to specific email to email, make sure sender email is added in IAM
    "recipient@example.com",
    "sender@example.com",
    subject,
    body,
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      /** @type { import('@aws-sdk/client-ses').MessageRejected} */
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

module.exports = { run };
```

```js
//routes/requests.js
const sendEmail = require("./utils/sendEmail");
//send connection api
//after connection.save()
const emailRes = sendEmail.run(
  `${fromUser.firstName} ${fromUser.lastName}${status === "interested" ? " is " : ""} ${status} ${status === "interested" ? " in " : ""}${toUser.firstName} ${toUser.lastName}`,
);
console.log(emailRes);
```

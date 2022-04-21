const aws = require("aws-sdk");

const SENDER = 'Servistory';
const SMS_SENDER_LAMBDA_NAME = 'smsSender';

const lambda = new aws.Lambda({
    apiVersion: "2015-03-31",
    endpoint: `lambda.${process.env.REGION}.amazonaws.com`
  });

exports.smsService = {
    sendMessage: async function(phone, message, customer) {
        const payload = JSON.stringify({
            sender: SENDER,
            phone,
            message,
            customer,
        });

        const functionName = `${SMS_SENDER_LAMBDA_NAME}-${process.env.ENV}`;
        console.log('functionName', functionName);

        const result = await lambda
        .invoke({
            FunctionName: functionName,
            InvocationType: "Event",
            Payload: payload
        })
        .promise()
        .then(() => {
            console.log('Message Sent');
        })
        .catch(error => {
            console.log('Message Sent Failed, error: ', error);
        });
        console.log(`${functionName} invoked`, result);
    }
};
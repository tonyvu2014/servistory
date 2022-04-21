const AWS = require('aws-sdk');
const SNS = new AWS.SNS();
const required = ['phone', 'sender', 'message'];

exports.handler = function (event) {
  const phone = event.phone;
  const sender = event.sender;
  const message = event.message;
  const customer = event.customer;
  const isPromotional = event.hasOwnProperty('Promotional') ? event.promotional : false;

  console.log(`==> Sending SMS to "${phone}" - Customer "${customer}": "${message}"`);

  return new Promise((resolve, reject) => {
    required.forEach(prop => {
      if (!event.hasOwnProperty(prop)) {
        reject(`Event is missing the require property "${prop}"`);
      }
    });
    resolve();
  }).then(() => {
    return SNS.publish({
      Message: message,
      MessageAttributes: {
        'AWS.SNS.SMS.SMSType': {
          DataType: 'String',
          StringValue: isPromotional ? 'Promotional' : 'Transactional'
        },
        'AWS.SNS.SMS.SenderID': {
          DataType: 'String',
          StringValue: sender
        },
      },
      PhoneNumber: phone
    }).promise();
  }).then(data => {
    console.log('[✓] Success');
    return data;
  }).catch(err => {
    console.log('[x] Failed', err);
    throw err;
  });
};
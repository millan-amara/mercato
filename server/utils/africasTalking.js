// utils/africasTalking.js
const africastalking = require('africastalking');

// Initialize
const at = africastalking({
  apiKey: process.env.AT_API_KEY, 
  username: process.env.AT_USERNAME,  // default 'sandbox' if using sandbox
});

// SMS service
const sms = at.SMS;

const sendSMS = async (to, message) => {
  try {
    const result = await sms.send({
      to: [`+${to}`], // Always international format like '2547...'
      message: message,
      // from: process.env.AT_SHORTCODE || 'AFRICASTALKING', // Optional sender ID
    });
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
    throw new Error('SMS sending failed');
  }
};

module.exports = sendSMS;

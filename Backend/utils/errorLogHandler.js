const nodemailer = require('nodemailer');
const ErrorLogs = require('../models/errorLogModel');

const errorLogHandler = async (sendEmail = false, subject = null, error = null, errorMessage = null, errorStatusCode = null, errorType = null, route = null, method = null, payload = null, headers = null) => {
  try {
    const errorLog = await ErrorLogs.create({
      errorType,
      error,
      errorMessage,
      errorStatusCode,
      route,
      method,
      payload,
      headers
    });
    if (sendEmail) {
      let mailTransporter = nodemailer.createTransport({
        host: `${process.env.MAIL_HOST}`,
        port: 465,
        auth: {
          user: process.env.MAIL,
          pass: process.env.MAIL_PSWD
        }
      });
      let htmlMailContent = `<p><b>Error message:</b> ${errorMessage ?? ''}</p>
            <p><b>Error Type:</b> ${errorType ?? ''}</p>
            <p><b>Error status code:</b> ${errorStatusCode ?? 500}</p>
            <p><b>Method:</b> ${method ?? ''}</p>
            <p><b>Route:</b> ${route ?? ''}</p>
            <p><b>Payload/Req. Body:</b> ${JSON.stringify(payload) ?? ''}</p>
            <p><b>Response:</b> ${JSON.stringify(response) ?? ''}</p>
            <p><b>Error Logged ID:</b> ${errorLog?._id ?? ''}</p>`;

      mailTransporter.sendMail({
        from: `Amplify Infra <${process.env.MAIL}>`,
        to: process.env.MAIL,
        subject,
        html: htmlMailContent
      });
    }
    return Promise.resolve();
  } catch (e) {
    console.log(e);
    return Promise.resolve()
  }
};
module.exports = {
  errorLogHandler
};
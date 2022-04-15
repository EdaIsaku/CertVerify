const fs = require('fs');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const path = require('path');
const schedule = require('node-schedule');
const { logger } = require('../logger/logger');

//OAuth2 authentication
const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oAuth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

//email to students with certificate
const sendEmail = async (course, studentEmail, name, lName, id) => {
  try {
    //transporter object
    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.USER,
        pass: process.env.PASSWORD,
      },
    });

    //details of email
    let mailOptions = {
      sender: 'QKUM',
      from: 'qkum@gmail.com',
      to: studentEmail,
      subject: `Your ${course} Certificate`,
      html: `<h3>Hello ${name}!</h3>
             <br/>
             <p>We're sending your certificate so you can download anytime.</p>
             `,
      attachments: [
        {
          filename: `${name}_${lName}.pdf`,
          path: path.join(
            __dirname,
            '../Certificates./',
            course,
            '_Certificates',
            `${id}.pdf`
          ),
        },
      ],
    };
    return await transporter.sendMail(mailOptions);
  } catch (error) {
    logger.error(`Error: ${error}`);
  }
};

//email to me with errors
const sendErrors = async () => {
  try {
    //transporter object
    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.USER,
        pass: process.env.PASSWORD,
      },
    });
    //details of email
    let errorFilePath = path.join(__dirname, '..', './logger/error.log');
    let mailOptions = {
      sender: 'QKUM',
      from: 'qkum@gmail.com',
      to: 'edaisaku0@gmail.com',
      subject: 'Errors in CertVerify',
      html: `<h3>Hello!</h3>
             <br/>
             <p>Errors in CertVerify for last 24H</p>
             `,
      attachments: [
        {
          filename: 'error.log',
          path: errorFilePath,
        },
      ],
    };
    //schedule errors email everyday at 13:00, if there are any errors
    return await schedule.scheduleJob('00 00 13 * * *', function () {
      fs.readFile(errorFilePath, (err, data) => {
        if (data.length == 0) {
          logger.info('No errors found');
        } else {
          transporter.sendMail(mailOptions);
        }
      });
    });
  } catch (error) {
    logger.error(`Error: ${error}`);
  }
};

module.exports = { sendEmail, sendErrors };

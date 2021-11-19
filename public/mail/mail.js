const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const path = require('path');

//OAuth2 authentication
const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oAuth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

const sendEmail = async (course, studentEmail, name, lName, id) => {
  try {
    //transporter object
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.USER,
        pass: process.env.PASSWORD,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
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
          path: path.join(__dirname, '../../BLSD_Certificates', `${id}.pdf`),
        },
      ],
    };
    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log('Error ' + error);
  }
};

module.exports = sendEmail;

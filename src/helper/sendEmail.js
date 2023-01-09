import nodemailer from 'nodemailer';
import env from 'dotenv';
import { google } from 'googleapis';
const OAuth2 = google.auth.OAuth2;
import { config } from '../../config.js';
env.config();

const OAuth2_client = new OAuth2(config.clientId, config.clientSecret);
OAuth2_client.setCredentials({ refresh_token: config.refreshToken });
export const sendEmailReset = (rescipient, url, text, name) => {
  const accessToken = OAuth2_client.getAccessToken();
  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: config.user,
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      refreshToken: config.refreshToken,
      accessToken: accessToken,
    },
  });
  const mail_opations = {
    from: `The Web Library < ${config.user} >`,
    to: rescipient,
    subject: 'Reset Password',
    html: get_html_message(name, url, text),
  };
  transport.sendMail(mail_opations, function (err, result) {
    if (err) {
      console.log('ERROR: ', err);
    } else {
      console.log('Success: ', result);
    }
    transport.close();
  });
};

function get_html_message(name, url, text) {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <style>
        .container {
          width: 100%;
          padding: 2rem 1rem;
          background: linear-gradient(to top left, rgb(248, 248, 248), rgb(136, 247, 255), rgb(76, 226, 237));
        }
        h3 {
          font-size: 24px;
          font-weight: 600;
        }
        a {
          color: blue;
        }
        p{
          font-size: 16px;
          width: 70%;
        }
      </style>
    </head>
    <body>
      <div class="container">
       <h1>Hai, ${name} !<h1/>
        <h3>PLEASE CLICK LINK BELOW TO RESET YOUR PASSWORD ACCOUNT 😉</h3>
        <a href=${url}>${text}</a>
        <p>${url}</p>
      </div>
    </body>
  </html>
      `;
}

// const OAUTH_PLAYGROUND = 'https://developers.google.com/oauthplayground';

// const { G_CLIENT_ID, G_CLIENT_SECRET, G_REFRESH_TOKEN, ADMIN_EMAIL } = process.env;

// const oauth2client = new OAuth2(G_CLIENT_ID, G_CLIENT_SECRET);
// oauth2client.setCredentials({
//   refresh_token: G_REFRESH_TOKEN,
// });

// export const sendEmailRegister = (to, url, text) => {
//   const accessToken = oauth2client.getAccessToken();
//   const smtpTransport = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       type: 'OAuth2',
//       user: ADMIN_EMAIL,
//       clientId: G_CLIENT_ID,
//       clientSecret: G_CLIENT_SECRET,
//       refreshToken: G_REFRESH_TOKEN,
//       accessToken: accessToken,
//     },
//   });
//   const mailOptions = {
//     from: `'The Web Library' <${ADMIN_EMAIL}>`,
//     to: to,
//     subject: 'ACTIVATE YOUR ACCOUNT',
//     html: `<!DOCTYPE html>
// <html lang="en">
//   <head>
//     <meta charset="UTF-8" />
//     <meta http-equiv="X-UA-Compatible" content="IE=edge" />
//     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//     <title>Reset Passoword</title>
//     <style>
//       .container {
//         width: 100%;
//         background: linear-gradient(to top left, rgb(248, 248, 248), rgb(136, 247, 255), rgb(76, 226, 237));
//       }
//       h3 {
//         font-size: 24px;
//         font-weight: 900;
//       }
//       a {
//         color: orange;
//       }
//     </style>
//   </head>
//   <body>
//     <div className="container">
//       <h3>CLICK LINK BELOW TO RESET YOUR PASSWORD ACCOUNT 😉</h3>
//       <a href=${url}>${text}</a>
//     </div>
//   </body>
// </html>
//     `,
//   };
//   smtpTransport.sendMail(mailOptions, (err, info) => {
//     if (err) {
//       console.log('error: ', err);
//     } else {
//       console.log('success: ', info);
//     }
//     smtpTransport.close();
//   });
// };

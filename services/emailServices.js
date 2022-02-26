const nodemailer = require("nodemailer");
// process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0; //Temporay solution

async function sendMail({ from, to, subject, text, html }) {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMT_PORT,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    let info = await transporter.sendMail({
      from: `Speedy Share <${from}>`,
      to: to,
      subject,
      text,
      html,
    });
    console.log(info);
  } catch (error) {
    console.log({ error: error });
  }
}

module.exports = sendMail;

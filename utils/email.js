import nodemailer from "nodemailer";

const { MAIL_SERVICE, MAIL_USER, MAIL_PASS } = process.env;

/**
 * Creates transporter object that will help us to send emails
 */
const transporter = nodemailer.createTransport({
  service: MAIL_SERVICE,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  },
});

/**
 *  Sends an email to user
 *
 * @param {string} to email address where to send mail
 * @param {string} subject of the email
 * @param {string} html content of the email
 */
export const sendEmail = async ({ to, subject, html }) => {
  try {
    const options = { from: MAIL_USER, to, subject, html };
    const mail = await transporter.sendMail(options);
    return mail;
  } catch (err) {
    console.log(err);
    return err;
  }
};

import * as nodemailer from "nodemailer";
var Mailgen = require("mailgen");

const transporter = nodemailer.createTransport({
  host: "smtp.yandex.ru",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendMail = async (pass: string, email: string) => {
  console.log({
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },)
  const config = {
    host: "smtp.yandex.ru",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  };

  const transporter = nodemailer.createTransport(config);

  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Anyboost",
      link: "https://mailgen.js/",
    },
  });

  const response = {
    body: {
      name: email,
      intro: "Your password is " + pass,
    },
    outro:
      "If you did not request a password, no further action is required on your part.",
  };

  const mail = mailGenerator.generate(response);

  const message = {
    from: "info@anyboost.net",
    to: email,
    subject: "Registration",
    html: mail,
  };

  const res = await transporter
    .sendMail(message)
    .catch((e) => console.error('mail error', e));

  return res;
};

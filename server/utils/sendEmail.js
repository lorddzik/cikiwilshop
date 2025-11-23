// server/utils/sendEmail.js
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Konfigurasi Transporter (Gunakan Gmail atau Mailtrap)
  // PENTING: Jika pakai Gmail, Anda harus buat 'App Password' di akun Google Anda.
  const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: process.env.EMAIL_USERNAME, // Tambahkan ini di .env
      pass: process.env.EMAIL_PASSWORD, // Tambahkan ini di .env
    },
  });

  const mailOptions = {
    from: '"CikiWil Support" <noreply@cikiwil.com>',
    to: options.email,
    subject: options.subject,
    html: options.message, // Kita gunakan HTML body
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
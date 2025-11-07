const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid-transport");
const ejs = require("ejs");
const path = require("path");

const sendEmail = async ({ to, subject, html, template, data, from }) => {
  let htmlContent;
  if (template) {
    // 1. Rendre le template EJS en HTML si un template est fourni
    htmlContent = await ejs.renderFile(
      path.join(__dirname, "..", "views", "emails", `${template}.ejs`),
      data
    );
  } else if (html) {
    htmlContent = html; // Use pre-rendered HTML if provided
  } else {
    throw new Error("Neither template nor html content provided for email.");
  }

  // 2. Configurer les options pour le transporteur SendGrid
  const options = {
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  };

  // 2. Créer le transporter avec le module SendGrid
  const transporter = nodemailer.createTransport(sgTransport(options));

  // 3. Définir les options de l'e-mail
  const mailOptions = {
    from: from || process.env.EMAIL_FROM,
    to: to,
    subject: subject,
    html: htmlContent,
  };

  // 4. Envoyer l'e-mail
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email envoyé avec succès via SendGrid:", info);
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de l'email via SendGrid:", error);
    throw new Error("L'envoi de l'email a échoué.");
  }
};

module.exports = {
  sendEmail,
};

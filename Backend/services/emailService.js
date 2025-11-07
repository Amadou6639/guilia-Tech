const nodemailer = require("nodemailer");

// Configuration du transporteur d'e-mail (SMTP)
// Utilisez des variables d'environnement pour les informations sensibles
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendNotificationEmail = async (subject, textContent) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM, // L'adresse e-mail de l'expéditeur
      to: process.env.NOTIFICATION_EMAIL_RECIPIENT, // L'adresse e-mail du destinataire de la notification
      subject: subject,
      text: textContent,
      // html: '<b>Contenu HTML optionnel</b>'
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ E-mail de notification envoyé avec succès.");
  } catch (error) {
    console.error(
      "❌ Erreur lors de l'envoi de l'e-mail de notification:",
      error
    );
  }
};

module.exports = {
  sendNotificationEmail,
};

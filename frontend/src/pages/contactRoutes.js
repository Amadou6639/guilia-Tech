const express = require("express");
const { body, validationResult } = require("express-validator");
const nodemailer = require("nodemailer");

const router = express.Router();

// POST /api/contact
// Route pour gérer l'envoi du formulaire de contact
router.post(
  "/",
  [
    // Validation des champs du formulaire
    body("name", "Le nom est requis").not().isEmpty().trim().escape(),
    body("email", "Veuillez fournir un email valide")
      .isEmail()
      .normalizeEmail(),
    body("subject", "Le sujet est requis").not().isEmpty().trim().escape(),
    body("message", "Le message est requis").not().isEmpty().trim().escape(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // S'il y a des erreurs de validation, les renvoyer
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, subject, message } = req.body;

    // Configuration du transporteur Nodemailer
    // Les informations sont tirées des variables d'environnement (.env)
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Contenu de l'email
    const mailOptions = {
      from: `"${name}" <${email}>`, // L'expéditeur sera l'utilisateur qui remplit le formulaire
      to: process.env.EMAIL_TO, // L'adresse qui recevra l'email (configurée dans .env)
      subject: `Nouveau message de contact : ${subject}`,
      html: `
        <h2>Nouveau message depuis le formulaire de contact</h2>
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Sujet :</strong> ${subject}</p>
        <hr>
        <p><strong>Message :</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    };

    try {
      // Envoi de l'email
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: "Message envoyé avec succès !" });
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email :", error);
      res.status(500).json({
        message:
          "Une erreur est survenue lors de l'envoi du message. Veuillez réessayer.",
      });
    }
  }
);

module.exports = router;

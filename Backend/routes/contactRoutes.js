const express = require("express");
const { body, validationResult } = require("express-validator");
const { sendEmail } = require("../utils/sendEmail"); // Import the centralized email function

module.exports = (pool) => {
  const router = express.Router();

  // POST /api/contact
  // Route to handle contact form submissions
  router.post(
    "/",
    [
      // Validate form fields
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
        // If there are validation errors, return them
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, subject, message } = req.body;

      // Construct the email content
      const html = `
        <h2>Nouveau message depuis le formulaire de contact</h2>
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Sujet :</strong> ${subject}</p>
        <hr>
        <p><strong>Message :</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `;

      try {
        // Send the email using the centralized function
        await sendEmail({
          from: `"${name}" <${email}>`, // The sender is the user filling out the form
          to: process.env.EMAIL_TO, // The recipient is configured in .env
          subject: `Nouveau message de contact : ${subject}`,
          html: html,
        });
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

  return router;
};
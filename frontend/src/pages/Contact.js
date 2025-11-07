import React, { useState } from "react";
import Footer from "../components/Footer";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: "",
  });

  const address = "Quartier Amriguebe, N'Djamena, Tchad";
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(
    address
  )}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: "" });

    try {
      // Note: L'endpoint /api/contact n'existe peut-être pas encore sur votre backend.
      // Il faudra le créer pour que le formulaire fonctionne.
      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("L'envoi du message a échoué. Veuillez réessayer.");
      }

      setStatus({ loading: false, success: true, error: "" });
      setFormData({ name: "", email: "", subject: "", message: "" }); // Vider le formulaire
    } catch (err) {
      setStatus({ loading: false, success: false, error: err.message });
    }
  };

  return (
    <>
      <div className="bg-white">
        {/* En-tête */}
        <div className="bg-gray-50 py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-extrabold text-blue-700 sm:text-5xl">
              Contactez-nous
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Nous sommes à votre écoute pour toute question ou demande
              d'information.
            </p>
          </div>
        </div>

        {/* Section principale */}
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              {/* Formulaire de contact */}
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Envoyez-nous un message
                </h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="sr-only">
                      Nom
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Votre nom complet"
                      className="block w-full px-4 py-3 rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="sr-only">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Votre adresse e-mail"
                      className="block w-full px-4 py-3 rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="sr-only">
                      Sujet
                    </label>
                    <input
                      type="text"
                      name="subject"
                      id="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Sujet de votre message"
                      className="block w-full px-4 py-3 rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="sr-only">
                      Message
                    </label>
                    <textarea
                      name="message"
                      id="message"
                      rows="5"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Votre message"
                      className="block w-full px-4 py-3 rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                  </div>
                  <div>
                    <button
                      type="submit"
                      disabled={status.loading}
                      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
                    >
                      {status.loading
                        ? "Envoi en cours..."
                        : "Envoyer le message"}
                    </button>
                  </div>
                </form>
                {status.success && (
                  <p className="mt-4 text-center text-green-600 bg-green-100 p-3 rounded-md">
                    Votre message a été envoyé avec succès ! Nous vous
                    répondrons bientôt.
                  </p>
                )}
                {status.error && (
                  <p className="mt-4 text-center text-red-600 bg-red-100 p-3 rounded-md">
                    Erreur : {status.error}
                  </p>
                )}
              </div>

              {/* Coordonnées et carte */}
              <div className="space-y-8">
                <div className="bg-white p-8 rounded-lg shadow-lg">
                  <h3 className="text-2xl font-bold text-blue-700 mb-4">
                    Nos Coordonnées
                  </h3>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      <strong>Adresse :</strong>
                      <br />
                      Quartier Amriguebe, non loin du lycée Féminin, Avenue
                      Djidingar Dongardoum, N'Djamena, Tchad
                    </p>
                    <p>
                      <strong>Email :</strong>
                      <br />
                      <a
                        href="mailto:guiliatechnologie@gmail.com"
                        className="text-blue-600 hover:underline"
                      >
                        guiliatechnologie@gmail.com
                      </a>
                    </p>
                    <div>
                      <p className="font-bold">Téléphones :</p>
                      <ul className="list-disc list-inside">
                        <li>
                          <a
                            href="tel:+23566396816"
                            className="text-blue-600 hover:underline"
                          >
                            +235 66 39 68 16
                          </a>
                        </li>
                        <li>
                          <a
                            href="tel:+23599396816"
                            className="text-blue-600 hover:underline"
                          >
                            +235 99 39 68 16
                          </a>
                        </li>
                        <li>
                          <a
                            href="tel:+23563937676"
                            className="text-blue-600 hover:underline"
                          >
                            +235 63 93 76 76
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg shadow-lg overflow-hidden">
                  <iframe
                    src={mapSrc}
                    width="100%"
                    height="350"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Carte de localisation de Guilia Tech Global Service"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      
    </>
  );
}

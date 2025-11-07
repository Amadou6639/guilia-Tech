import React, { useState, useRef, useEffect } from "react";
import Footer from "../components/Footer";

const trainings = [
  {
    id: 1,
    title: "Initiation au numérique",
    description:
      "Maîtrisez les bases de l’informatique et des outils digitaux.",
    icon: "🖥️",
    duree: " 14 jours (14 heures)",
    publicCible: "Débutants, sans prérequis techniques.",
    modalite: "Présentiel ou à distance (visioconférence)",
    horaires: "9h00 - 17h00",
    prerequis: "Aucun",
    objectifs: [
      "Prise en main de l'ordinateur et de son système d'exploitation.",
      "Utilisation des outils bureautiques (Word, Excel).",
      "Navigation efficace et sécurisée sur Internet.",
      "Gestion des emails et de la sécurité de base.",
    ],
  },
  {
    id: 2,
    title: "Maintenance informatique",
    description:
      "Apprenez à diagnostiquer, réparer et entretenir vos équipements.",
    icon: "🛠️",
    duree: "3 jours (21 heures)",
    publicCible: "Utilisateurs souhaitant gagner en autonomie.",
    modalite: "Présentiel (ateliers pratiques)",
    horaires: "9h30 - 17h30",
    prerequis: "Connaissances de base en informatique.",
    objectifs: [
      "Diagnostiquer les pannes matérielles et logicielles courantes.",
      "Effectuer des réparations de premier niveau.",
      "Optimiser et entretenir son ordinateur.",
      "Appliquer les bonnes pratiques pour prolonger la vie du matériel.",
    ],
  },
  {
    id: 3,
    title: "Sécurité et bonnes pratiques",
    description: "Protégez vos données et adoptez les bons réflexes en ligne.",
    icon: "🔒",
    duree: "1 jour (7 heures)",
    publicCible: "Tous les utilisateurs (particuliers et professionnels).",
    modalite: "Présentiel ou à distance",
    horaires: "9h00 - 17h00",
    prerequis: "Utilisation régulière d'Internet.",
    objectifs: [
      "Comprendre les risques (phishing, malwares, etc.).",
      "Protéger ses données personnelles et professionnelles.",
      "Gérer ses mots de passe de manière sécurisée.",
      "Adopter les bons réflexes pour la navigation et les achats en ligne.",
    ],
  },
  {
    id: 4,
    title: "Formation sur mesure",
    description: "Des modules personnalisés selon vos besoins et votre niveau.",
    icon: "🎯",
    duree: "Variable",
    publicCible: "Entreprises, associations, particuliers.",
    modalite: "Toutes modalités possibles",
    horaires: "Flexibles",
    prerequis: "À définir selon le programme.",
    objectifs: [
      "Programme entièrement personnalisé pour répondre à des besoins spécifiques.",
    ],
  },
];

export default function Training() {
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const detailsRef = useRef(null);

  // États pour la gestion du formulaire
  const [form, setForm] = useState({
    nom: "",
    email: "",
    tel: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [sent, setSent] = useState(false); // Pour afficher le message de succès

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.nom.trim()) newErrors.nom = "Le nom est requis.";
    if (!form.email.trim()) {
      newErrors.email = "L'email est requis.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "L'adresse email est invalide.";
    }
    if (!form.tel.trim()) newErrors.tel = "Le téléphone est requis.";
    return newErrors;
  };

  const toggleDetails = (id) => {
    if (selected === id) {
      setSelected(null);
      setShowForm(false);
    } else {
      setSelected(id);
      setShowForm(false);
      setSent(false);
      setApiError("");
      setErrors({});
      setForm({ nom: "", email: "", tel: "", message: "" });
    }
  };

  useEffect(() => {
    if (selected !== null && detailsRef.current) {
      detailsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selected]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setApiError("");

    const selectedTraining = trainings.find((t) => t.id === selected);
    const requestBody = {
      nom: form.nom,
      email: form.email,
      tel: form.tel,
      besoin: `Inscription à la formation : "${
        selectedTraining.title
      }". Message : ${form.message || "Aucun message."}`,
    };

    try {
      const res = await fetch("http://localhost:5000/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.error || "Erreur lors de l'envoi de la demande."
        );
      }
      setSent(true);
    } catch (err) {
      setApiError(
        "Impossible d'envoyer la demande. Veuillez réessayer plus tard."
      );
      console.error("Erreur d'inscription:", err);
    } finally {
      setLoading(false);
    }
  };

  const selectedTraining = selected !== null ? trainings.find(t => t.id === selected) : null;

  return (
    <>
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-6 text-center">
          Nos Formations
        </h1>
        <p className="text-lg text-gray-600 mb-8 text-center">
          Découvrez nos offres de formation en numérique et maintenance
          informatique, adaptées à tous les profils.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {trainings.map((training) => (
            <div
              key={training.id}
              className="bg-white rounded-lg shadow p-6 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full"
              onClick={() => toggleDetails(training.id)}
            >
              <div className="text-5xl mb-4">{training.icon}</div>
              <h2 className="text-2xl font-bold mb-2 text-blue-600">
                {training.title}
              </h2>
              <p className="text-gray-700 mb-4 flex-grow">
                {training.description}
              </p>
              <button className="mt-auto bg-transparent border border-blue-600 text-blue-600 px-4 py-2 rounded-full hover:bg-blue-600 hover:text-white transition-colors">
                {selected === training.id
                  ? "Masquer les détails"
                  : "Voir les détails"}
              </button>
            </div>
          ))}
        </div>

        {selectedTraining && (
          <div ref={detailsRef} className="bg-blue-50 p-6 rounded-lg shadow-inner mt-8 text-left w-full animate-fade-in">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-2xl mb-4 text-blue-800">
                Détails de la formation : {selectedTraining.title}
              </h3>
              <button onClick={() => setSelected(null)} className="text-2xl text-gray-500 hover:text-gray-800">&times;</button>
            </div>
            <div className="space-y-3 text-gray-800">
              <p>
                <strong>🗓️ Durée :</strong> {selectedTraining.duree}
              </p>
              <p>
                <strong>👥 Public :</strong> {selectedTraining.publicCible}
              </p>
              <p>
                <strong>📍 Modalité :</strong> {selectedTraining.modalite}
              </p>
              <p>
                <strong>⏰ Horaires :</strong> {selectedTraining.horaires}
              </p>
              <p>
                <strong>🎓 Prérequis :</strong> {selectedTraining.prerequis}
              </p>
              <div>
                <strong className="block mb-1">🎯 Objectifs :</strong>
                <ul className="list-disc list-inside pl-4 space-y-1">
                  {selectedTraining.objectifs.map((obj, i) => (
                    <li key={i}>{obj}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-6 text-center">
              <button
                className="bg-green-600 text-white font-bold px-6 py-2 rounded-full hover:bg-green-700 transition-transform transform hover:scale-105"
                onClick={() => {
                  setShowForm(true);
                  setSent(false);
                }}
              >
                S'inscrire à cette formation
              </button>
            </div>
          </div>
        )}

        {showForm && selected !== null && (
          <div className="bg-gray-100 p-6 rounded shadow max-w-md mx-auto mt-8">
            <h2 className="text-xl font-bold mb-4 text-blue-700">
              Formulaire d'inscription à :{" "}
              {trainings.find((t) => t.id === selected)?.title || ""}
            </h2>
            {sent ? (
              <div className="bg-green-100 text-green-800 p-4 rounded">
                <p className="font-bold">Demande envoyée avec succès !</p>
                <p>
                  Nous vous recontacterons bientôt pour finaliser votre
                  inscription.
                </p>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <input
                    name="nom"
                    value={form.nom}
                    onChange={handleChange}
                    className={`w-full border p-2 rounded ${
                      errors.nom ? "border-red-500" : "border-gray-300"
                    }`}
                    type="text"
                    placeholder="Votre nom complet *"
                    required
                  />
                  {errors.nom && (
                    <p className="text-red-500 text-sm mt-1">{errors.nom}</p>
                  )}
                </div>
                <div>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className={`w-full border p-2 rounded ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    type="email"
                    placeholder="Votre email *"
                    required
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
                <div>
                  <input
                    name="tel"
                    value={form.tel}
                    onChange={handleChange}
                    className={`w-full border p-2 rounded ${
                      errors.tel ? "border-red-500" : "border-gray-300"
                    }`}
                    type="tel"
                    placeholder="Votre téléphone *"
                    required
                  />
                  {errors.tel && (
                    <p className="text-red-500 text-sm mt-1">{errors.tel}</p>
                  )}
                </div>
                <div>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    className="w-full border p-2 rounded border-gray-300"
                    placeholder="Message ou besoin particulier (optionnel)"
                    rows="3"
                  />
                </div>
                <button
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Envoi en cours..." : "Envoyer ma demande"}
                </button>
                {apiError && (
                  <div className="bg-red-100 text-red-800 p-3 rounded mt-4 text-center">
                    {apiError}
                  </div>
                )}
              </form>
            )}
          </div>
        )}
      </div>
    
    </>
  );
}

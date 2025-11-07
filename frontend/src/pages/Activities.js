import React from "react";
import Footer from "../components/Footer";

const activities = [
  {
    title: "Conseil Stratégique en Technologie",
    description:
      "Nous analysons vos processus métiers et vos objectifs pour vous proposer des stratégies technologiques sur mesure. De l'audit de votre système d'information à la recommandation d'architectures cloud, nous vous guidons vers les meilleures décisions.",
    icon: "🧭",
  },
  {
    title: "Courtage et Intermédiation",
    description:
      "Trouver le bon prestataire ou la bonne solution peut être complexe. Nous agissons comme votre intermédiaire de confiance, en sélectionnant et en négociant avec les meilleurs experts et fournisseurs pour garantir le succès de vos projets IT.",
    icon: "🤝",
  },
  {
    title: "Développement de Solutions Personnalisées",
    description:
      "Quand les solutions standards ne suffisent pas, nous pilotons le développement d'applications web et mobiles personnalisées, parfaitement adaptées à vos besoins uniques pour vous donner un avantage concurrentiel.",
    icon: "💡",
  },
  {
    title: "Formation et Montée en Compétences",
    description:
      "La technologie évolue vite. Nous proposons des programmes de formation pour vos équipes, couvrant des sujets allant de la cybersécurité aux outils de productivité, assurant ainsi leur montée en compétences continue.",
    icon: "🎓",
  },
  {
    title: "Maintenance et Support Informatique",
    description:
      "Nous assurons la performance et la fiabilité de votre parc informatique grâce à nos services de maintenance préventive, de support réactif et d'optimisation de vos équipements et logiciels.",
    icon: "🛠️",
  },
];

export default function Activities() {
  return (
    <>
      <div className="p-8 max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-6 text-center">
          Nos Activités
        </h1>
        <p className="text-lg text-gray-600 mb-12 text-center">
          Au-delà de nos services, nos activités quotidiennes sont dédiées à
          l'innovation et à l'accompagnement de nos clients vers la réussite
          numérique.
        </p>
        <div className="space-y-10">
          {activities.map((activity, idx) => (
            <div
              key={idx}
              className="flex flex-col md:flex-row items-center gap-8 p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow"
            >
              <div className="text-6xl">{activity.icon}</div>
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-blue-600 mb-2">
                  {activity.title}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {activity.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}

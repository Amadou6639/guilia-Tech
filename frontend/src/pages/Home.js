import { API_URL_WITH_PATH } from '../config/api';
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import TrainingTeaser from "../components/TrainingTeaser";
import FeaturedPartners from "../components/FeaturedPartners";
import { getResponsiveImageUrls } from "./imageHelper";
import { useActiveSection } from "./ActiveSectionContext";

// Composant pour le squelette de chargement d'une carte d'article
const PostCardSkeleton = () => (
  <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
    <div className="flex-shrink-0">
      <div className="h-48 w-full bg-gray-300 animate-pulse"></div>
    </div>
    <div className="flex-1 bg-white p-6 flex flex-col justify-between">
      <div className="flex-1">
        <div className="h-4 w-1/4 bg-gray-300 rounded animate-pulse mb-4"></div>
        <div className="h-6 w-full bg-gray-300 rounded animate-pulse mb-3"></div>
        <div className="h-6 w-3/4 bg-gray-300 rounded animate-pulse"></div>
        <div className="mt-4 space-y-2">
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
      <div className="mt-6 flex items-center">
        <div className="h-4 w-1/3 bg-gray-300 rounded animate-pulse"></div>
      </div>
    </div>
  </div>
);

// Composant pour le squelette de chargement d'une carte de service
const ServiceCardSkeleton = () => (
  <div className="bg-white p-8 rounded-lg shadow-lg animate-pulse">
    <div className="h-6 w-3/4 bg-gray-300 rounded mb-4"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded"></div>
      <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
    </div>
  </div>
);

// Composant HOC pour observer les sections
const SectionWrapper = ({ children, id }) => {
  const { setActiveSection } = useActiveSection();
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActiveSection(id);
        }
      },
      {
        root: null, // par rapport au viewport
        rootMargin: "0px",
        threshold: 0.5, // se déclenche quand 50% de la section est visible
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [id, setActiveSection]);

  return React.cloneElement(children, { ref: sectionRef });
};

export default function Home() {
  const address = "Quartier Amriguebe, N'Djamena, Tchad";
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(
    address
  )}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  const [latestPosts, setLatestPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState(null);

  const testimonials = [
    {
      quote:
        "Guilia Tech a transformé notre approche du numérique. Leur expertise en courtage nous a permis de trouver le prestataire idéal pour notre projet d'application mobile, tout en respectant notre budget. Un partenaire indispensable !",
      name: "Amina Diallo",
      role: "Directrice, Sahel Innov'",
      avatar: "https://i.pravatar.cc/100?u=amina",
    },
    {
      quote:
        "En tant que PME, nous n'avions ni le temps ni les compétences pour gérer notre parc informatique. L'équipe de Guilia Tech a non seulement optimisé nos équipements, mais nous a aussi formés à de meilleures pratiques de sécurité. Leur réactivité est exemplaire.",
      name: "Idriss Mahamat",
      role: "Gérant, Logistique Express",
      avatar: "https://i.pravatar.cc/100?u=idriss",
    },
    {
      quote:
        "La formation sur les outils bureautiques a été un véritable succès pour nos équipes. Le formateur était pédagogue et le contenu parfaitement adapté à nos besoins. Nous avons gagné en productivité dès la première semaine.",
      name: "Fatime Ousmane",
      role: "Responsable RH, BTP Tchad",
      avatar: "https://i.pravatar.cc/100?u=fatime",
    },
  ];

  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        // L'API renvoie déjà les articles du plus récent au plus ancien
        const response = await fetch(`${API_URL_WITH_PATH}/blog`);
        if (!response.ok) {
          throw new Error("Impossible de charger les derniers articles.");
        }
        const data = await response.json();
        setLatestPosts(data.posts.slice(0, 3)); // On ne garde que les 3 premiers
      } catch (error) {
        console.error("Erreur de chargement des articles:", error);
      } finally {
        setPostsLoading(false);
      }
    };
    fetchLatestPosts();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setServicesLoading(true);
        const response = await fetch(
         `${API_URL_WITH_PATH}/services/public`
        );
        if (!response.ok) {
          throw new Error("Impossible de charger les services.");
        }
        const data = await response.json();
        setServices(data.services.slice(0, 4)); // On ne garde que les 4 premiers
        setServicesError(null);
      } catch (error) {
        console.error("Erreur de chargement des services:", error);
        setServicesError(error.message);
      } finally {
        setServicesLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="text-center py-20 px-4 sm:px-6 lg:px-8 bg-blue-700 text-white">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 flex items-center justify-center">
          <img
            src="/favicon.ico"
            alt="Guilia Tech Logo"
            className="h-12 md:h-16 mr-4"
          />
          Guilia Tech Global Service
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto">
          Votre partenaire de confiance pour le courtage et l'intermédiation en
          solutions technologiques et formations sur mesure.
        </p>
        <Link
          to="/contact"
          className="mt-8 inline-block bg-white text-blue-700 font-bold px-8 py-3 rounded-full hover:bg-blue-100 transition-transform transform hover:scale-105"
        >
          Demandez un service
        </Link>
      </div>

      {/* Section Services */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Nos Services
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Des solutions pensées pour votre transformation numérique.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {servicesLoading ? (
              <>
                <ServiceCardSkeleton />
                <ServiceCardSkeleton />
                <ServiceCardSkeleton />
                <ServiceCardSkeleton />
              </>
            ) : servicesError ? (
              <div className="col-span-full text-center text-red-500">
                <p>{servicesError}</p>
              </div>
            ) : (
              services.map((service) => (
                <Link
                  key={service.id}
                  to={`/services/${service.id}`}
                  className="block bg-white p-8 rounded-lg shadow-lg transform hover:-translate-y-2 transition-transform duration-300"
                >
                  <h3 className="text-xl font-bold text-blue-700">
                    {service.icon} {service.title}
                  </h3>
                  <p className="mt-2 text-gray-600">{service.description}</p>
                </Link>
              ))
            )}
          </div>
          <div className="mt-12 text-center">
            <Link
              to="/services"
              className="text-lg font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            >
              Voir tous les services &rarr;
            </Link>
          </div>
        </div>
      </section>

      <TrainingTeaser />

      <FeaturedPartners />

      {/* Section Témoignages */}
      <section className="py-16 sm:py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Ce que disent nos clients
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              La confiance et la satisfaction de nos clients sont notre plus
              grande fierté.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-1 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-lg flex flex-col justify-between transform hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="flex-grow">
                  <div className="text-blue-500 text-6xl leading-none font-serif">
                    “
                  </div>
                  <p className="text-gray-600 italic -mt-4">
                    {testimonial.quote}
                  </p>
                </div>
                <div className="mt-6 flex items-center">
                  <img
                    className="h-12 w-12 rounded-full object-cover"
                    src={testimonial.avatar}
                    alt={`Avatar de ${testimonial.name}`}
                  />
                  <div className="ml-4">
                    <p className="font-bold text-blue-700">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Derniers Articles */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Dernières Actualités
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Suivez nos analyses et conseils sur le monde du numérique.
            </p>
          </div>

          {postsLoading ? (
            // Afficher les squelettes de chargement
            <div className="mt-12 max-w-lg mx-auto grid gap-8 lg:grid-cols-3 lg:max-w-none">
              <PostCardSkeleton />
              <PostCardSkeleton />
              <PostCardSkeleton />
            </div>
          ) : (
            <div className="mt-12 max-w-lg mx-auto grid gap-8 lg:grid-cols-3 lg:max-w-none">
              {latestPosts.map((post) => (
                <div
                  key={post.slug}
                  className="flex flex-col rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300"
                >
                  <Link to={`/blog/${post.slug}`} className="flex-shrink-0">
                    <picture>
                      <source
                        media="(min-width: 640px)"
                        srcSet={getResponsiveImageUrls(post.image_url).medium}
                      />
                      <source
                        srcSet={getResponsiveImageUrls(post.image_url).small}
                      />
                    </picture>
                  </Link>
                  <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-600">
                        <Link
                          to={`/blog?category=${encodeURIComponent(
                            post.category
                          )}`}
                          className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold tracking-wide uppercase hover:bg-blue-200 transition-colors"
                        >
                          {post.category}
                        </Link>
                      </p>
                      <Link to={`/blog/${post.slug}`} className="block mt-2">
                        <p className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                          {post.title}
                        </p>
                        <p className="mt-3 text-base text-gray-500">
                          {post.excerpt}
                        </p>
                      </Link>
                    </div>
                    <div className="mt-6 flex items-center">
                      <p className="text-sm font-medium text-gray-500">
                        {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-12 text-center">
            <Link
              to="/blog"
              className="text-lg font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            >
              Voir tous les articles &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Section "Comment ça marche ?" */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Comment ça marche ?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Un processus simple et transparent en 4 étapes.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4 text-center">
            <div className="p-4">
              <div className="text-3xl font-bold text-blue-600 mb-2">1</div>
              <h3 className="text-lg font-semibold">Soumettez votre besoin</h3>
              <p className="mt-1 text-gray-600">
                Remplissez notre formulaire en quelques clics pour nous décrire
                votre projet.
              </p>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-blue-600 mb-2">2</div>
              <h3 className="text-lg font-semibold">Analyse et conseil</h3>
              <p className="mt-1 text-gray-600">
                Nous étudions votre demande et vous proposons une stratégie
                personnalisée.
              </p>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-blue-600 mb-2">3</div>
              <h3 className="text-lg font-semibold">
                Sélection des prestataires
              </h3>
              <p className="mt-1 text-gray-600">
                Nous identifions les meilleurs experts ou solutions pour votre
                besoin.
              </p>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-blue-600 mb-2">4</div>
              <h3 className="text-lg font-semibold">Mise en œuvre et suivi</h3>
              <p className="mt-1 text-gray-600">
                Nous vous accompagnons jusqu'à la finalisation de votre projet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <SectionWrapper id="contact">
        <section id="contact" className="py-16 sm:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-gray-900">
                Contactez-nous
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Nous sommes à votre écoute pour toute question ou demande
                d'information.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold text-blue-700 mb-4">
                  Nos Coordonnées
                </h3>
                <div className="space-y-4 text-gray-700">
                  <p>
                    <strong>Adresse :</strong>
                    <br />
                    Quartier Amriguebe, non loin du lycée Féminin, Avenue
                    Djidingar Donongardoum, N'Djamena, Tchad
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
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Carte de localisation de Guilia Tech Global Service"
                ></iframe>
              </div>
            </div>
          </div>
        </section>
      </SectionWrapper>

      {/* Call to Action Section */}
      <section className="bg-blue-700">
        <div className="max-w-3xl mx-auto text-center py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white">
            Prêt à démarrer votre projet ?
          </h2>
          <p className="mt-4 text-lg text-blue-100">
            Contactez-nous dès aujourd'hui pour une consultation gratuite et
            sans engagement.
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-block bg-white text-blue-700 font-bold px-8 py-3 rounded-full hover:bg-blue-100 transition-transform transform hover:scale-105"
          >
            Contactez-nous
          </Link>
        </div>
      </section>

      {/* Subscribe Section */}
      <section className="bg-blue-800 text-white py-16 sm:py-20">
        <div className="max-w-3xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold mb-4">
            Abonnez-vous dès maintenant !
          </h2>
          <p className="text-lg mb-8">
            Gardez une longueur d’avance et ne manquez aucune de nos actualités,
            offres exclusives et conseils technologiques.
          </p>
          <Link
            to="/subscribe"
            className="inline-block bg-white text-blue-800 font-bold px-8 py-3 rounded-full hover:bg-blue-100 transition-transform transform hover:scale-105"
          >
            S'abonner
          </Link>
        </div>
      </section>

  
    </div>
  );
}

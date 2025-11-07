import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import NotFound from "./NotFound";
import { getResponsiveImageUrls } from "./imageHelper";

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/blog/${slug}`);
        if (!response.ok) {
          throw new Error("Article non trouvé");
        }
        const data = await response.json();
        setPost(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return <div className="text-center py-20">Chargement de l'article...</div>;
  }

  if (error || !post) {
    return <NotFound />;
  }

  const imageUrls = getResponsiveImageUrls(post.image_url);

  return (
      <div className="bg-white py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <Link
              to="/blog"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              &larr; Retour au blog
            </Link>
          </div>

          <article>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              {post.title}
            </h1>
            <div className="flex items-center text-sm text-gray-500 mb-6">
              <span>Par {post.author}</span>
              <span className="mx-2">&bull;</span>
              <time dateTime={post.created_at}>
                {new Date(post.created_at).toLocaleDateString()}
              </time>
            </div>

            <picture className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg mb-8 block">
              {/* Pour les grands écrans, charger l'image large */}
              <source media="(min-width: 1024px)" srcSet={imageUrls.large} />
              {/* Pour les écrans moyens, charger l'image moyenne */}
              <source media="(min-width: 640px)" srcSet={imageUrls.medium} />
              {/* Pour les petits écrans, charger la petite image */}
              <source srcSet={imageUrls.small} />
              {/* Image de secours pour les anciens navigateurs */}
              <img
                src={imageUrls.original}
                alt={`Illustration pour ${post.title}`}
                className="w-full h-full object-cover rounded-lg"
                loading="lazy"
              />
            </picture>

            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            ></div>
          </article>
        </div>
      </div>
  );
}

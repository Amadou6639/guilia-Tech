import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getResponsiveImageUrls } from "./imageHelper";

export default function Blog() {
  const location = useLocation();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // State for search and filter, derived from URL for shareable links
  const searchParams = new URLSearchParams(location.search);
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );

  const [pagination, setPagination] = useState({
    page: parseInt(searchParams.get("page")) || 1,
    pages: 1,
    total: 0,
  });

  // Fetch categories and posts
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        // Fetch categories
        const catResponse = await fetch(
          "http://localhost:5000/api/blog/categories"
        );
        if (catResponse.ok) {
          const catData = await catResponse.json();
          setCategories(catData);
        } else {
          console.error("Failed to load categories");
        }
      } catch (err) {
        console.error("Error loading categories:", err);
      }
    };
    fetchInitialData();
  }, []);

  // Fetch posts whenever the URL search params change
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams(location.search);
        // Ensure limit is set for pagination
        if (!params.has("limit")) {
          params.set("limit", "6");
        }

        const url = `http://localhost:5000/api/blog?${params.toString()}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to fetch posts.");
        }
        const data = await response.json();
        setPosts(data.posts || []);
        setPagination({
          page: data.page || 1,
          pages: data.pages || 1,
          total: data.total || 0,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [location.search]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(location.search);
    if (searchTerm.trim()) {
      params.set("search", searchTerm.trim());
    } else {
      params.delete("search");
    }
    params.set("page", "1"); // Reset to first page on new search
    navigate(`/blog?${params.toString()}`);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    const params = new URLSearchParams(location.search);
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    params.set("page", "1"); // Reset to first page on category change
    navigate(`/blog?${params.toString()}`);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(location.search);
    params.set("page", newPage);
    navigate(`/blog?${params.toString()}`);
  };

  return (
      <div className="bg-gray-50 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-blue-700">
              Notre Blog
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Restez informé des dernières tendances, analyses et actualités du
              numérique au Tchad et ailleurs.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mt-8 max-w-lg mx-auto">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                placeholder="Rechercher un article..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Rechercher
              </button>
            </form>
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              <button
                onClick={() => handleCategorySelect("")}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  selectedCategory === ""
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-200 border"
                }`}
              >
                Toutes
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                    selectedCategory === cat
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-200 border"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {loading && (
            <div className="text-center py-10">Chargement des articles...</div>
          )}
          {error && (
            <div className="text-center py-10 text-red-600">{error}</div>
          )}
          {!loading && !error && posts.length > 0 && (
            <div className="mt-12 max-w-lg mx-auto grid gap-8 lg:grid-cols-3 lg:max-w-none">
              {posts.map((post) => (
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
                        <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold tracking-wide uppercase">
                          {post.category}
                        </span>
                      </p>
                      <Link to={`/blog/${post.slug}`} className="block mt-2">
                        <p className="text-xl font-semibold text-gray-900">
                          {post.title}
                        </p>
                        <p className="mt-3 text-base text-gray-500">
                          {post.excerpt}
                        </p>
                      </Link>
                    </div>
                    <div className="mt-6 flex items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {post.author}
                        </p>
                        <div className="flex space-x-1 text-sm text-gray-500">
                          <time dateTime={post.created_at}>
                            {new Date(post.created_at).toLocaleDateString()}
                          </time>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {!loading && posts.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              Aucun article trouvé pour les critères sélectionnés.
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center items-center mt-12 gap-4">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg shadow-sm hover:bg-gray-50 transition-colors disabled:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Précédent
              </button>
              <span className="text-gray-700 font-medium">
                Page {pagination.page} sur {pagination.pages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg shadow-sm hover:bg-gray-50 transition-colors disabled:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Suivant
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
  );
}

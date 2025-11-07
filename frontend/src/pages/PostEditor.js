import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import des styles de l'éditeur

export default function PostEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  // useRef est maintenant importé
  const quillRef = useRef(null);
  const isEditing = Boolean(id);

  const [post, setPost] = useState({
    title: "",
    content: "",
    excerpt: "",
    author: "",
    image_url: "",
    category: "Général",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getAuthHeader = () => {
    const token = localStorage.getItem("admintoken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchPost = useCallback(async () => {
    if (!isEditing) return;
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/blog/id/${id}`, {
        headers: getAuthHeader(),
      });
      if (!response.ok) throw new Error("Article non trouvé");
      const data = await response.json();
      setPost(data);
    } catch (err) {
      setError("Erreur de chargement de l'article.");
    } finally {
      setLoading(false);
    }
  }, [id, isEditing]);

  useEffect(() => {
    fetchPost();
    const adminName = localStorage.getItem("AdminName"); // Utilisation de AdminName
    if (adminName && !isEditing) {
      setPost((p) => ({ ...p, author: adminName }));
    }
  }, [fetchPost, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost((prev) => ({ ...prev, [name]: value }));
  };

  // Handler spécifique pour ReactQuill
  const handleContentChange = (content) => {
    setPost((prev) => ({ ...prev, content }));
  };

  // Handler pour l'upload d'image
  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("image", file);

        // Afficher un loader ou un message
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection(true);
        quill.insertText(range.index, "Chargement de l'image...", "user");

        try {
          const response = await fetch(
            "http://localhost:5000/api/blog/upload-image",
            {
              method: "POST",
              headers: getAuthHeader(),
              body: formData,
            }
          );

          const data = await response.json();
          if (!response.ok) {
            throw new Error(
              data.error || "Erreur lors de l'upload de l'image."
            );
          }

          // Supprimer le texte de chargement et insérer l'image
          quill.deleteText(range.index, "Chargement de l'image...".length);
          quill.insertEmbed(
            range.index,
            "image",
            `http://localhost:5000${data.imageUrl}`
          );
          quill.setSelection(range.index + 1);
        } catch (err) {
          console.error(err);
          setError(err.message);
          // Supprimer le texte de chargement en cas d'erreur
          quill.deleteText(range.index, "Chargement de l'image...".length);
        }
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const url = isEditing
      ? `http://localhost:5000/api/blog/${id}` // PUT /api/blog/:id
      : "http://localhost:5000/api/blog";
    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify(post),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue.");
      }

      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return <div className="text-center py-20">Chargement de l'article...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">
        {isEditing ? "Modifier l'article" : "Créer un nouvel article"}
      </h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-8 rounded-lg shadow-md"
      >
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>
        )}

        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Titre
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={post.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label
            htmlFor="excerpt"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Extrait (résumé)
          </label>
          <textarea
            name="excerpt"
            id="excerpt"
            value={post.excerpt}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border rounded-lg"
          ></textarea>
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Contenu complet
          </label>
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={post.content}
            onChange={handleContentChange}
            className="bg-white"
            modules={{
              toolbar: {
                container: [
                  [{ header: [1, 2, 3, false] }],
                  ["bold", "italic", "underline", "strike"],
                  ["link", "image"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["clean"],
                ],
                handlers: { image: imageHandler },
              },
            }}
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Catégorie
          </label>
          <input
            type="text"
            name="category"
            id="category"
            value={post.category}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label
            htmlFor="author"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Auteur
          </label>
          <input
            type="text"
            name="author"
            id="author"
            value={post.author}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label
            htmlFor="image_url"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            URL de l'image
          </label>
          <input
            type="text"
            name="image_url"
            id="image_url"
            value={post.image_url}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div className="flex justify-end gap-4">
          {/* Correction du commentaire qui causait l'erreur */}
          <Link
            to="/admin/dashboard"
            className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-400"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </form>
    </div>
  );
}

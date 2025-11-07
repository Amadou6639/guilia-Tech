/**
 * Génère différentes tailles d'image à partir d'une URL de base.
 * NOTE : Ceci est une simulation. Pour que cela fonctionne en production,
 * le backend doit réellement créer et servir ces fichiers (ex: image-lg.webp, image-md.webp).
 * @param {string} baseUrl - L'URL de l'image originale.
 * @returns {{large: string, medium: string, small: string, original: string}}
 */
export const getResponsiveImageUrls = (baseUrl) => {
  if (!baseUrl || typeof baseUrl !== "string") {
    const placeholder = "https://via.placeholder.com/800x400";
    return {
      large: placeholder,
      medium: placeholder,
      small: placeholder,
      original: placeholder,
    };
  }

  const lastDotIndex = baseUrl.lastIndexOf(".");
  const baseName = baseUrl.substring(0, lastDotIndex);
  const extension = baseUrl.substring(lastDotIndex);

  return {
    large: `${baseName}-lg${extension}`,
    medium: `${baseName}-md${extension}`,
    small: `${baseName}-sm${extension}`,
    original: baseUrl,
  };
};

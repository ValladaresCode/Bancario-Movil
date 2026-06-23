// Helper para multipart/form-data en React Native.
// En RN NO existe el objeto File del navegador: las imágenes de expo-image-picker
// se adjuntan como un objeto nativo { uri, name, type }.

// Deriva { name, type } de la URI manteniendo coherencia con lo que valida Multer.
export const guessImagePart = (uri) => {
  if (!uri) return null;
  const lower = String(uri).toLowerCase();
  let ext = 'jpg';
  let type = 'image/jpeg';
  if (lower.endsWith('.png')) {
    ext = 'png';
    type = 'image/png';
  } else if (lower.endsWith('.jpeg')) {
    ext = 'jpeg';
    type = 'image/jpeg';
  } else if (lower.endsWith('.webp')) {
    ext = 'webp';
    type = 'image/webp';
  }
  return { uri, name: `profile.${ext}`, type };
};

/**
 * Construye un FormData a partir de campos de texto y, opcionalmente, una imagen.
 * @param {Object} fields - pares clave/valor de texto (se omiten null/undefined/'').
 * @param {Object} [image] - { uri, field } donde field por defecto es 'profilePicture'.
 */
export const buildFormData = (fields = {}, image = null) => {
  const formData = new FormData();

  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      formData.append(key, String(value));
    }
  });

  if (image?.uri) {
    const part = guessImagePart(image.uri);
    if (part) {
      formData.append(image.field || 'profilePicture', part);
    }
  }

  return formData;
};

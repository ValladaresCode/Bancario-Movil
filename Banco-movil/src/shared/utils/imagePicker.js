import * as ImagePicker from 'expo-image-picker';

// Abre la galería y devuelve la URI de la imagen elegida (objeto nativo para FormData).
export async function pickProfileImage() {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    return { canceled: true, error: 'Necesitamos permiso para acceder a tus fotos.' };
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.7,
  });

  if (result.canceled) {
    return { canceled: true };
  }

  return { canceled: false, uri: result.assets[0].uri };
}

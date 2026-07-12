import { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';

import { Button, EmptyState, LoadingSpinner } from '../../../shared/components';
import { SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { confirmAction, notify } from '../../../shared/utils/confirm';
import { AddFavoriteForm, EditAliasModal, FavoriteCard } from '../components';
import { useFavorites } from '../hooks/useFavorites';

// Pantalla de favoritos: lista + alta + edición de alias + transferencia rápida.
// La UI de cada pieza vive en ../components; aquí solo se orquesta el estado.
export function FavoritesScreen({ navigation }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const { favorites, loading, error, refetch, addFavorite, updateFavorite, removeFavorite } = useFavorites();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const onDelete = (item) => {
    confirmAction({
      title: 'Eliminar favorito',
      message: `¿Eliminar "${item.alias}"?`,
      confirmText: 'Eliminar',
      destructive: true,
      onConfirm: async () => {
        const result = await removeFavorite(item._id);
        if (!result.ok) notify('Error', result.error);
      },
    });
  };

  if (loading && favorites.length === 0) {
    return <LoadingSpinner message="Cargando favoritos..." />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => String(item._id)}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} tintColor={colors.primary} />}
        ListHeaderComponent={
          <View style={styles.headerArea}>
            <Button
              title={showForm ? 'Cancelar' : '+ Agregar favorito'}
              variant={showForm ? 'ghost' : 'secondary'}
              onPress={() => setShowForm((v) => !v)}
            />
            {showForm ? <AddFavoriteForm addFavorite={addFavorite} onSuccess={() => setShowForm(false)} /> : null}
          </View>
        }
        ListEmptyComponent={
          <EmptyState icon="star-border" title="Sin favoritos" message={error || 'Agrega cuentas para transferir rápido.'} />
        }
        renderItem={({ item }) => (
          <FavoriteCard
            favorite={item}
            onTransfer={() => navigation.navigate('TransferToFavorite', { favorite: item })}
            onEdit={() => setEditing(item)}
            onDelete={() => onDelete(item)}
          />
        )}
      />
      <EditAliasModal favorite={editing} onSave={updateFavorite} onClose={() => setEditing(null)} />
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: SPACING.lg, gap: SPACING.sm },
  headerArea: { gap: SPACING.sm, marginBottom: SPACING.sm },
});

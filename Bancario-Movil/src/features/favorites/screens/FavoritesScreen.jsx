import { useState } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Button, Card, EmptyState, Input, LoadingSpinner, Selector } from '../../../shared/components';
import { ACCOUNT_TYPE_OPTIONS } from '../../../shared/constants';
import { COLORS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { maskAccountNumber } from '../../../shared/utils/format';
import { useFavorites } from '../hooks/useFavorites';

export function FavoritesScreen({ navigation }) {
  const { favorites, loading, error, refetch, addFavorite, removeFavorite } = useFavorites();
  const [showForm, setShowForm] = useState(false);
  const [cuenta, setCuenta] = useState('');
  const [alias, setAlias] = useState('');
  const [tipo, setTipo] = useState(ACCOUNT_TYPE_OPTIONS[0].value);
  const [submitting, setSubmitting] = useState(false);

  const onAdd = async () => {
    if (!cuenta.trim() || !alias.trim()) {
      Alert.alert('Atención', 'Completa cuenta y alias.');
      return;
    }
    setSubmitting(true);
    const result = await addFavorite({ cuenta: cuenta.trim(), alias: alias.trim(), tipo });
    setSubmitting(false);
    if (!result.ok) {
      Alert.alert('Error', result.error);
      return;
    }
    setCuenta('');
    setAlias('');
    setShowForm(false);
  };

  const onDelete = (item) => {
    Alert.alert('Eliminar favorito', `¿Eliminar "${item.alias}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          const result = await removeFavorite(item._id);
          if (!result.ok) Alert.alert('Error', result.error);
        },
      },
    ]);
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
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} tintColor={COLORS.primary} />}
        ListHeaderComponent={
          <View style={styles.headerArea}>
            <Button
              title={showForm ? 'Cancelar' : '+ Agregar favorito'}
              variant={showForm ? 'ghost' : 'secondary'}
              onPress={() => setShowForm((v) => !v)}
            />
            {showForm ? (
              <Card style={styles.form}>
                <Input label="Número de cuenta" keyboardType="number-pad" value={cuenta} onChangeText={setCuenta} />
                <Input label="Alias" placeholder="Ej: Mamá" value={alias} onChangeText={setAlias} />
                <Selector label="Tipo de cuenta" options={ACCOUNT_TYPE_OPTIONS} value={tipo} onChange={setTipo} />
                <Button title="Guardar favorito" onPress={onAdd} loading={submitting} />
              </Card>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          <EmptyState icon="star-border" title="Sin favoritos" message={error || 'Agrega cuentas para transferir rápido.'} />
        }
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <View style={styles.iconWrap}>
              <MaterialIcons name="star" size={22} color={COLORS.warning} />
            </View>
            <View style={styles.middle}>
              <Text style={styles.alias}>{item.alias}</Text>
              <Text style={styles.muted}>
                {maskAccountNumber(item.cuenta)} · {item.tipo}
              </Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() => navigation.navigate('TransferToFavorite', { favorite: item })}
                style={styles.transferBtn}
              >
                <MaterialIcons name="send" size={18} color={COLORS.primary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onDelete(item)} style={styles.deleteBtn}>
                <MaterialIcons name="delete-outline" size={18} color={COLORS.danger} />
              </TouchableOpacity>
            </View>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  list: { padding: SPACING.lg, gap: SPACING.sm },
  headerArea: { gap: SPACING.sm, marginBottom: SPACING.sm },
  form: { gap: SPACING.xs },
  card: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.warningBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  middle: { flex: 1 },
  alias: { fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.text },
  muted: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: SPACING.xs },
  actions: { flexDirection: 'row', gap: SPACING.sm },
  transferBtn: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtn: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.dangerBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import { FlatList, Image, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Button, Card, EmptyState, LoadingSpinner } from '../../../shared/components';
import { COLORS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { formatCurrency } from '../../../shared/utils/format';
import { useServices } from '../hooks/useServices';

export function ServicesScreen({ navigation }) {
  const { services, loading, error, refetch } = useServices();

  if (loading && services.length === 0) {
    return <LoadingSpinner message="Cargando servicios..." />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={services}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} tintColor={COLORS.primary} />}
        ListHeaderComponent={
          <Button
            title="Ver promociones"
            variant="secondary"
            onPress={() => navigation.navigate('Promotions')}
            style={styles.promoBtn}
          />
        }
        ListEmptyComponent={
          <EmptyState icon="local-offer" title="Sin servicios" message={error || 'No hay servicios disponibles.'} />
        }
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('ServiceDetail', { id: item.id })}>
            <Card style={styles.card}>
              {item.imageUrl ? (
                <Image source={{ uri: item.imageUrl }} style={styles.image} />
              ) : (
                <View style={[styles.image, styles.imagePlaceholder]}>
                  <MaterialIcons name="image" size={28} color={COLORS.textMuted} />
                </View>
              )}
              <View style={styles.info}>
                <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.category}>{item.category} · {item.type}</Text>
                <Text style={styles.price}>
                  {item.price !== undefined ? formatCurrency(item.price, item.currency) : 'Precio no definido'}
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={COLORS.textMuted} />
            </Card>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  list: { padding: SPACING.lg, gap: SPACING.sm },
  promoBtn: { marginBottom: SPACING.sm },
  card: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  image: { width: 64, height: 64, borderRadius: RADIUS.md, backgroundColor: COLORS.surfaceAlt },
  imagePlaceholder: { alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1 },
  name: { fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.text },
  category: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: SPACING.xs },
  price: { fontSize: FONT_SIZE.lg, fontWeight: '800', color: COLORS.primary, marginTop: SPACING.xs },
});

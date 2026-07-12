import { FlatList, Image, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Button, Card, EmptyState, LoadingSpinner } from '../../../shared/components';
import { FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { formatCurrency } from '../../../shared/utils/format';
import { useServices } from '../hooks/useServices';

export function ServicesScreen({ navigation }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
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
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} tintColor={colors.primary} />}
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
                  <MaterialIcons name="local-offer" size={28} color={colors.primary} />
                </View>
              )}
              <View style={styles.info}>
                <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.category} numberOfLines={1}>{item.category} · {item.type}</Text>
                <Text style={styles.price}>
                  {item.price !== undefined ? formatCurrency(item.price, item.currency) : 'Precio no definido'}
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={colors.textMuted} />
            </Card>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: SPACING.lg, gap: SPACING.md },
  promoBtn: { marginBottom: SPACING.sm },
  card: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  image: { width: 64, height: 64, borderRadius: RADIUS.md, backgroundColor: colors.primaryLight },
  imagePlaceholder: { alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1 },
  name: { fontSize: FONT_SIZE.md, fontFamily: FONTS.semibold, fontWeight: '700', color: colors.text },
  category: { fontSize: FONT_SIZE.xs, fontFamily: FONTS.body, color: colors.textMuted, marginTop: SPACING.xs },
  price: { fontSize: FONT_SIZE.lg, fontFamily: FONTS.displayBold, fontWeight: '800', color: colors.primary, marginTop: SPACING.xs },
});

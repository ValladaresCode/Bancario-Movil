import { FlatList, Image, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Card, EmptyState, LoadingSpinner } from '../../../shared/components';
import { COLORS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { formatDate } from '../../../shared/utils/format';
import { usePromotions } from '../hooks/usePromotions';

export function PromotionsScreen({ navigation }) {
  const { promotions, loading, error, refetch } = usePromotions();

  if (loading && promotions.length === 0) {
    return <LoadingSpinner message="Cargando promociones..." />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={promotions}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} tintColor={COLORS.primary} />}
        ListEmptyComponent={
          <EmptyState icon="campaign" title="Sin promociones" message={error || 'No hay promociones activas.'} />
        }
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('PromotionDetail', { id: item.id })}>
            <Card style={styles.card}>
              {item.imageUrl ? (
                <Image source={{ uri: item.imageUrl }} style={styles.image} />
              ) : (
                <View style={[styles.image, styles.imagePlaceholder]}>
                  <MaterialIcons name="campaign" size={32} color={COLORS.primary} />
                </View>
              )}
              <Text style={styles.name}>{item.name}</Text>
              {item.description ? <Text style={styles.muted} numberOfLines={2}>{item.description}</Text> : null}
              {item.endDate ? <Text style={styles.validity}>Vigente hasta {formatDate(item.endDate)}</Text> : null}
            </Card>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  list: { padding: SPACING.lg, gap: SPACING.md },
  card: { gap: SPACING.xs },
  image: { width: '100%', height: 140, borderRadius: RADIUS.md, backgroundColor: COLORS.surfaceAlt },
  imagePlaceholder: { alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: FONT_SIZE.lg, fontWeight: '800', color: COLORS.text, marginTop: SPACING.xs },
  muted: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary },
  validity: { fontSize: FONT_SIZE.xs, color: COLORS.primary, fontWeight: '700', marginTop: SPACING.xs },
});

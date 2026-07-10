import { FlatList, Image, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Badge, Card, EmptyState, LoadingSpinner } from '../../../shared/components';
import { FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { formatDate } from '../../../shared/utils/format';
import { usePromotions } from '../hooks/usePromotions';

export function PromotionsScreen({ navigation }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
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
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} tintColor={colors.primary} />}
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
                  <MaterialIcons name="campaign" size={32} color={colors.primary} />
                </View>
              )}
              <View style={styles.headerRow}>
                <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                {item.discount ? <Badge label={`-${item.discount}%`} tone="warning" /> : null}
              </View>
              {item.description ? <Text style={styles.muted} numberOfLines={2}>{item.description}</Text> : null}
              {item.endDate ? (
                <View style={styles.validityRow}>
                  <MaterialIcons name="schedule" size={14} color={colors.primary} />
                  <Text style={styles.validity}>Vigente hasta {formatDate(item.endDate)}</Text>
                </View>
              ) : null}
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
  card: { gap: SPACING.xs },
  image: { width: '100%', height: 140, borderRadius: RADIUS.md, backgroundColor: colors.primaryLight },
  imagePlaceholder: { alignItems: 'center', justifyContent: 'center' },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: SPACING.sm, marginTop: SPACING.xs },
  name: { flex: 1, fontSize: FONT_SIZE.lg, fontFamily: FONTS.bold, fontWeight: '800', color: colors.text },
  muted: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.body, color: colors.textMuted },
  validityRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, marginTop: SPACING.xs },
  validity: { fontSize: FONT_SIZE.xs, fontFamily: FONTS.semibold, color: colors.primary, fontWeight: '700' },
});

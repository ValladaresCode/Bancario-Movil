import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Card, EmptyState, GradientCard, LoadingSpinner } from '../../../shared/components';
import { FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { formatDate } from '../../../shared/utils/format';
import { usePromotions } from '../hooks/usePromotions';

export function PromotionDetailScreen({ route }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const id = route?.params?.id;
  const { getPromotionById } = usePromotions();
  const [promo, setPromo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      const result = await getPromotionById(id);
      if (!mounted) return;
      if (result.ok) setPromo(result.data);
      else setError(result.error);
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [id, getPromotionById]);

  if (loading) return <LoadingSpinner message="Cargando promoción..." />;
  if (!promo) return <EmptyState icon="error-outline" title="No disponible" message={error} />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {promo.imageUrl ? (
        <Image source={{ uri: promo.imageUrl }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <MaterialIcons name="campaign" size={40} color={colors.primary} />
        </View>
      )}

      <Text style={styles.name}>{promo.name}</Text>

      {promo.discount ? (
        <GradientCard style={styles.discountCard} contentStyle={styles.discountContent}>
          <View style={styles.discountIcon}>
            <MaterialIcons name="sell" size={22} color={colors.white} />
          </View>
          <View>
            <Text style={styles.discountLabel}>Descuento</Text>
            <Text style={styles.discount}>{promo.discount}%</Text>
          </View>
        </GradientCard>
      ) : null}

      {promo.description ? (
        <Card>
          <Text style={styles.sectionTitle}>Detalles</Text>
          <Text style={styles.body}>{promo.description}</Text>
        </Card>
      ) : null}

      {promo.terms ? (
        <Card>
          <Text style={styles.sectionTitle}>Términos y condiciones</Text>
          <Text style={styles.body}>{promo.terms}</Text>
        </Card>
      ) : null}

      {promo.startDate || promo.endDate ? (
        <Card>
          <Text style={styles.sectionTitle}>Vigencia</Text>
          <Text style={styles.body}>
            {formatDate(promo.startDate)} — {formatDate(promo.endDate)}
          </Text>
        </Card>
      ) : null}
    </ScrollView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: SPACING.lg, gap: SPACING.md },
  image: { width: '100%', height: 180, borderRadius: RADIUS.lg, backgroundColor: colors.primaryLight },
  imagePlaceholder: { alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: FONT_SIZE.xxl, fontFamily: FONTS.displayBold, fontWeight: '800', color: colors.text },
  discountCard: { marginTop: SPACING.xs },
  discountContent: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  discountIcon: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  discountLabel: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.medium, color: colors.white, opacity: 0.85 },
  discount: { fontSize: FONT_SIZE.xl, fontFamily: FONTS.displayBold, color: colors.white, fontWeight: '800' },
  sectionTitle: { fontSize: FONT_SIZE.md, fontFamily: FONTS.semibold, fontWeight: '700', color: colors.text, marginBottom: SPACING.xs },
  body: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.body, color: colors.textSecondary, lineHeight: 20 },
});

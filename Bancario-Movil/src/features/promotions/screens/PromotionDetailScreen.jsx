import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Card, EmptyState, LoadingSpinner } from '../../../shared/components';
import { COLORS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { formatDate } from '../../../shared/utils/format';
import { usePromotions } from '../hooks/usePromotions';

export function PromotionDetailScreen({ route }) {
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
          <MaterialIcons name="campaign" size={40} color={COLORS.primary} />
        </View>
      )}

      <Text style={styles.name}>{promo.name}</Text>
      {promo.discount ? <Text style={styles.discount}>Descuento: {promo.discount}%</Text> : null}

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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, gap: SPACING.md },
  image: { width: '100%', height: 180, borderRadius: RADIUS.lg, backgroundColor: COLORS.surfaceAlt },
  imagePlaceholder: { alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: FONT_SIZE.xxl, fontWeight: '800', color: COLORS.text },
  discount: { fontSize: FONT_SIZE.md, color: COLORS.success, fontWeight: '700' },
  sectionTitle: { fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.xs },
  body: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, lineHeight: 20 },
});

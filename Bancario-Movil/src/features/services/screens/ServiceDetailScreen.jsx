import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Badge, Card, EmptyState, LoadingSpinner } from '../../../shared/components';
import { COLORS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { formatCurrency } from '../../../shared/utils/format';
import { useServices } from '../hooks/useServices';

export function ServiceDetailScreen({ route }) {
  const id = route?.params?.id;
  const { getServiceById } = useServices();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      const result = await getServiceById(id);
      if (!mounted) return;
      if (result.ok) setService(result.data);
      else setError(result.error);
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [id, getServiceById]);

  if (loading) return <LoadingSpinner message="Cargando servicio..." />;
  if (!service) return <EmptyState icon="error-outline" title="No disponible" message={error} />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {service.imageUrl ? (
        <Image source={{ uri: service.imageUrl }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <MaterialIcons name="image" size={40} color={COLORS.textMuted} />
        </View>
      )}

      <Text style={styles.name}>{service.name}</Text>
      <View style={styles.metaRow}>
        <Badge label={service.category} tone="info" />
        <Badge label={service.type} tone="success" />
      </View>

      <Card style={styles.priceCard}>
        <Text style={styles.priceLabel}>Precio</Text>
        <Text style={styles.price}>
          {service.price !== undefined ? formatCurrency(service.price, service.currency) : 'No definido'}
        </Text>
        {service.discount ? <Text style={styles.discount}>Descuento: {service.discount}%</Text> : null}
      </Card>

      {service.description ? (
        <Card>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.body}>{service.description}</Text>
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
  metaRow: { flexDirection: 'row', gap: SPACING.sm },
  priceCard: { gap: SPACING.xs },
  priceLabel: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary },
  price: { fontSize: FONT_SIZE.xxl, fontWeight: '800', color: COLORS.primary },
  discount: { fontSize: FONT_SIZE.sm, color: COLORS.success, fontWeight: '700' },
  sectionTitle: { fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.xs },
  body: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, lineHeight: 20 },
});

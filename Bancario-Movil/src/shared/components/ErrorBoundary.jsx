import { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { COLORS, FONTS, FONT_SIZE, RADIUS, SPACING } from '../constants/theme';

// Captura errores de render de la pantalla hija para que NUNCA quede una página
// en blanco: muestra un fallback con el mensaje del error y un botón de reintento.
export class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Útil para depurar en la consola del navegador / Metro.
    console.error('[ErrorBoundary]', error, info?.componentStack);
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
      return (
        <View style={styles.container}>
          <View style={styles.iconCircle}>
            <MaterialIcons name="error-outline" size={36} color={COLORS.danger} />
          </View>
          <Text style={styles.title}>Algo salió mal</Text>
          <Text style={styles.message}>No se pudo mostrar esta pantalla.</Text>
          {this.state.error?.message ? (
            <Text style={styles.detail} numberOfLines={4}>
              {String(this.state.error.message)}
            </Text>
          ) : null}
          <TouchableOpacity style={styles.btn} onPress={this.reset} activeOpacity={0.85}>
            <Text style={styles.btnText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

// HOC para envolver un componente de pantalla con el ErrorBoundary.
export function withErrorBoundary(ScreenComponent) {
  function Wrapped(props) {
    return (
      <ErrorBoundary>
        <ScreenComponent {...props} />
      </ErrorBoundary>
    );
  }
  Wrapped.displayName = `withErrorBoundary(${ScreenComponent.displayName || ScreenComponent.name || 'Screen'})`;
  return Wrapped;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    gap: SPACING.sm,
    backgroundColor: COLORS.background,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.dangerBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  title: { fontSize: FONT_SIZE.lg, fontFamily: FONTS.displayBold, fontWeight: '700', color: COLORS.text },
  message: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.body, color: COLORS.textSecondary, textAlign: 'center' },
  detail: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.body,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  btn: {
    marginTop: SPACING.md,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
  },
  btnText: { color: COLORS.white, fontFamily: FONTS.bold, fontWeight: '700', fontSize: FONT_SIZE.sm },
});

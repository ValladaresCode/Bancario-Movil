---
name: react-native-and-react-expert
description: Reglas y mejores prácticas para el desarrollo e interoperabilidad de aplicaciones Web (React) y Móviles (React Native/Expo).
triggers: ["crear componente", "pantalla react", "optimizar flatlist", "configurar expo"]
---

# Habilidad: React y React Native Expert

Usa esta guía siempre que se realicen tareas de desarrollo web con React, aplicaciones móviles con Bare React Native o proyectos administrados con Expo.

## 1. Reglas Críticas (Evitar Errores de Contexto)

* **Etiquetas Web vs. Nativas**: En React Native está estrictamente prohibido usar etiquetas HTML (`<div>`, `<p>`, `<span>`). Se deben mapear a componentes nativos (`<View>`, `<Text>`).
* **Renderizado de Texto**: Todo texto en React Native debe estar envuelto exclusivamente dentro de un componente `<Text>`. De lo contrario, la aplicación lanzará un error crítico (crash).
* **Renderizado Condicional**: Evitar el patrón falsy `&&` en React Native (ej. `isValid && <Component />` si `isValid` puede ser `0`). Usar siempre operadores ternarios explícitos para evitar renderizar números que rompan la UI nativa.

## 2. Optimización de Listas (Prioridad Alta)

* **Uso de FlatList**: Para listas grandes en React Native, usar `<FlatList>` en lugar de `.map()`.
* **Funciones renderItem**: No declarar funciones `renderItem` inline. Memorizarlas con `useCallback` para evitar nuevas instancias en cada renderizado.
* **FlashList**: Si el proyecto tiene configurado Shopify FlashList, priorizarlo sobre FlatList para mejorar el rendimiento de la memoria.

## 3. Animaciones e Interacciones

* **Reanimated**: Priorizar el uso de `react-native-reanimated` sobre la API `Animated` nativa de JS.
* **Propiedades del Sistema**: Animar únicamente propiedades optimizadas por GPU como `transform` y `opacity`.
* **Componentes de Presión**: Usar `Gesture.Tap` de `react-native-gesture-handler` o `Pressable` en lugar del componente obsoleto `TouchableOpacity`.

## 4. Gestión de Estado y Datos

* **Separación de Capas**: Mantener la lógica de negocio (hooks personalizados, selectores) separada de la capa de presentación (componentes visuales).
* **Suscripciones Mínimas**: Minimizar el estado global en los componentes para evitar re-renders masivos.

## 5. Casos Bordes y Plataforma

* **SafeAreaView**: Utilizar siempre contenedores de área segura para gestionar muescas (notches) en dispositivos iOS y Android modernos.
* **Dimensiones Dinámicas**: Evitar guardar `Dimensions.get('window')` en constantes estáticas; usar el hook `useWindowDimensions` para responder correctamente a la rotación de pantalla.

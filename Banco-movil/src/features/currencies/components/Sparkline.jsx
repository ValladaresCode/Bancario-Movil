import Svg, { Polygon, Polyline } from 'react-native-svg';

// Mini gráfica de línea (estilo ticker bursátil). Sin ejes ni etiquetas a propósito:
// solo comunica tendencia. `filled` agrega un área translúcida bajo la línea para
// la vista ampliada del modal.
export function Sparkline({ points, color, width = 56, height = 24, strokeWidth = 2, filled = false }) {
  if (!points || points.length < 2) return null;

  const values = points.map((point) => point.rate);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const pad = strokeWidth;
  const usableHeight = height - pad * 2;

  const coords = values.map((value, index) => {
    const x = (index / (values.length - 1)) * width;
    const y = pad + usableHeight - ((value - min) / range) * usableHeight;
    return [x, y];
  });

  const lineStr = coords.map(([x, y]) => `${x},${y}`).join(' ');

  return (
    <Svg width={width} height={height}>
      {filled ? (
        <Polygon
          points={`0,${height} ${lineStr} ${width},${height}`}
          fill={color}
          fillOpacity={0.15}
        />
      ) : null}
      <Polyline
        points={lineStr}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </Svg>
  );
}

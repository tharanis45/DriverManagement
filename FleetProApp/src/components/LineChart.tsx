import React from 'react';
import {View} from 'react-native';
import Svg, {Polyline, Polygon} from 'react-native-svg';

export default function LineChart({
  points,
  color,
  height = 130,
}: {
  points: number[];
  color: string;
  height?: number;
}) {
  const width = 300;
  const pad = 6;
  const max = Math.max(...points, 100);
  const step = (width - 2 * pad) / (points.length - 1);

  const coords = points.map((p, i) => {
    const x = pad + i * step;
    const y = height - 10 - (p / max) * (height - 30);
    return `${x},${y}`;
  });
  const linePts = coords.join(' ');
  const areaPts = `${pad},${height - 10} ${linePts} ${width - pad},${
    height - 10
  }`;

  return (
    <View style={{width: '100%'}}>
      <Svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none">
        <Polygon points={areaPts} fill={color} opacity={0.12} />
        <Polyline
          points={linePts}
          fill="none"
          stroke={color}
          strokeWidth={2.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}

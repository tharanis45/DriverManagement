import React from 'react';
import {View} from 'react-native';
import Svg, {Circle} from 'react-native-svg';

type Segment = {value: number; color: string};

export default function DonutChart({
  segments,
  size = 110,
  strokeWidth = 16,
}: {
  segments: Segment[];
  size?: number;
  strokeWidth?: number;
}) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const r = (size - strokeWidth) / 2;
  const c = size / 2;
  const circumference = 2 * Math.PI * r;
  let offset = 0;

  return (
    <View style={{width: size, height: size}}>
      <Svg width={size} height={size}>
        {segments.map((seg, i) => {
          const frac = seg.value / total;
          const dash = frac * circumference;
          const el = (
            <Circle
              key={i}
              cx={c}
              cy={c}
              r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
              origin={`${c}, ${c}`}
              rotation={-90}
            />
          );
          offset += dash;
          return el;
        })}
      </Svg>
    </View>
  );
}

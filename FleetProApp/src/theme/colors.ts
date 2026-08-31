export const colors = {
  navy: '#16204f',
  navy2: '#22307a',
  blue: '#3457d5',
  blueLight: '#5c85f7',
  bg: '#eef1f8',
  card: '#ffffff',
  text: '#2a2f45',
  muted: '#757c8c',
  muted2: '#9aa1b5',
  green: '#16a34a',
  greenBg: '#dcfce7',
  amber: '#b45309',
  amberBg: '#fef3c7',
  red: '#dc2626',
  redBg: '#fee2e2',
  purple: '#7c3aed',
  purpleBg: '#ede9fe',
  navbar: '#141a3a',
  line: '#e7e9f2',
  white: '#ffffff',
};

export const gradients = {
  header: [colors.navy, colors.navy2, colors.blueLight] as const,
  headerLocations: [0, 0.45, 1] as const,
  payrollCard: [colors.navy, colors.blue] as const,
  splash: ['#2541c9', '#4f7df9', '#6a95ff'] as const,
  loginTop: [colors.navy, colors.blue] as const,
  truckIcon: [colors.blue, colors.blueLight] as const,
};

export const radii = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 22,
  pill: 999,
};

export const spacing = (n: number) => n * 4;

export const avatarColors = [
  '#3457d5',
  '#16a34a',
  '#f59e0b',
  '#7c3aed',
  '#ec4899',
  '#0891b2',
  '#dc2626',
];

export function colorForName(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

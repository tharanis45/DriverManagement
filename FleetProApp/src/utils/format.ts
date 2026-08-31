export function fmt(n: number): string {
  return '₹' + Math.round(n).toLocaleString('en-IN');
}

export function fmtK(n: number): string {
  if (n >= 100000) {
    return '₹' + (n / 100000).toFixed(1) + 'L';
  }
  if (n >= 1000) {
    return '₹' + Math.round(n / 1000) + 'k';
  }
  return '₹' + Math.round(n);
}

export function initials(name: string): string {
  return name
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function addDaysISO(days: number): string {
  return new Date(Date.now() + days * 86400000).toISOString().slice(0, 10);
}

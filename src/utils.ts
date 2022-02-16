export function getRandomElement<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

export function allStrings(items: unknown[]): items is string[] {
  return items.every(item => typeof item === 'string');
}

export function groupBy<T>(items: T[], fn: (item: T) => string | number) {
  return items.reduce((acc, item) => {
    const value = fn(item);
    acc[value] = (acc[value] || []).concat([ item ]);
    return acc;
  }, {} as Record<string, T[]>);
}

export function getCommonPrefix(s1: string, s2: string) {
  const l = Math.min(s1.length, s2.length);
  let i = 0;
  while (i < l && s1.charAt(i) === s2.charAt(i)) i++;
  return s1.substring(0, i);
}

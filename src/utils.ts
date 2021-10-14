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

import { allStrings, getRandomElement, groupBy } from './utils';
import { getCommonWords, getLongWords } from './words';

export type RandomSelectState = Record<string, number[]>;

export interface RandomSelectOptions {
  /**
   * When selecting next item lib can calc common words with last used value,
   * and select item having minimal common words.
   */
  useMostDifferentValues?: boolean;
  /**
   * Disable random for testing purposes.
   */
  disableRandom?: boolean;
}

const defaults = {
  useMostDifferentValues: true,
  disableRandom: false,
};

export class RandomSelect {
  options: Required<RandomSelectOptions>;

  constructor(public state: RandomSelectState = {}, options: RandomSelectOptions = {}) {
    this.options = Object.assign({}, defaults, options);
  }

  select<T>(items: T[]) {
    if (items.length <= 1) return items[0];
    const key = this.getKey(items);
    const indexes = items.map((_, index) => index);
    const usedIndexes = this.getUsedIndexes(key, indexes);
    const allowedIndexes = this.getAllowedIndexes(usedIndexes, indexes, items);
    const index = getRandomElement(allowedIndexes);
    usedIndexes.push(index);
    // even with disableRandom calc index to get close to production use
    return this.options.disableRandom ? items[0] : items[index];
  }

  private getKey(items: unknown[]) {
    return items
      .map(item => typeof item === 'string' ? item : JSON.stringify(item))
      .map(item => item.substr(0, 15))
      .join('|');
  }

  private getUsedIndexes(key: string, indexes: number[]) {
    let usedIndexes = this.state[key] || [];
    // handle rotation (keep last used index to avoid possible repeating after clearing usedIndexes)
    if (usedIndexes.length >= indexes.length) usedIndexes = usedIndexes.slice(-1);
    return this.state[key] = usedIndexes;
  }

  private getAllowedIndexes(usedIndexes: number[], indexes: number[], items: unknown[]) {
    const allowedIndexes = indexes.filter(index => !usedIndexes.includes(index));
    return (this.options.useMostDifferentValues && usedIndexes.length >= 1 && allStrings(items))
      ? this.getMostDifferentIndexes(usedIndexes, allowedIndexes, items)
      : allowedIndexes;
  }

  private getMostDifferentIndexes(usedIndexes: number[], allowedIndexes: number[], items: string[]) {
    const lastValue = items[usedIndexes[usedIndexes.length - 1]];
    const lastWords = getLongWords(lastValue);
    const commonWordCountsMap = groupBy(allowedIndexes, index => {
      const itemWords = getLongWords(items[index]);
      return getCommonWords(lastWords, itemWords).length;
    });
    const counts = Object.keys(commonWordCountsMap).map(Number);
    const minCommonWordsCount = Math.min(...counts);
    return commonWordCountsMap[minCommonWordsCount];
  }
}

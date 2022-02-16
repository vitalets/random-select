import { allStrings, getRandomElement, groupBy, getCommonPrefix } from './utils';
import { getCommonWords, getLongWords } from './words';
import { RandomSelectOptions, defaults } from './options';

export type RandomSelectState = Record<string, number[]>;

export interface SelectOptions {
  key?: string;
}

export class RandomSelect {
  static defaults = defaults;
  state: RandomSelectState;
  options: Required<RandomSelectOptions>;

  constructor(state: RandomSelectState = {}, options: RandomSelectOptions = {}) {
    this.state = state || {};
    this.options = Object.assign({}, RandomSelect.defaults, options);
  }

  select<T>(items: T[], options: SelectOptions = {}) {
    if (items.length <= 1) return items[0];
    const key = options.key || this.getKey(items);
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
      .map(item => {
        return typeof item === 'string'
          ? item
          : JSON.stringify(item).replace(/"/g, '');
      })
      .sort()
      .map((item, i, arr) => {
        // exclude common prefix from item strings
        const startIndex = i === 0 ? 0 : getCommonPrefix(item, arr[i - 1]).length;
        return item.substring(startIndex, startIndex + this.options.keyItemLength);
      })
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
    return (this.options.commonWordsMinLength && usedIndexes.length >= 1 && allStrings(items))
      ? this.getAllowedIndexesByCommonWords(usedIndexes, allowedIndexes, items)
      : allowedIndexes;
  }

  private getAllowedIndexesByCommonWords(usedIndexes: number[], allowedIndexes: number[], items: string[]) {
    const lastValue = items[usedIndexes[usedIndexes.length - 1]];
    const lastWords = getLongWords(lastValue);
    // map: (common words count) -> (indexes)
    const commonWordsMap = groupBy(allowedIndexes, index => {
      const itemWords = getLongWords(items[index]);
      return getCommonWords(lastWords, itemWords).length;
    });
    const counts = Object.keys(commonWordsMap).map(Number);
    const minCommonWordsCount = Math.min(...counts);
    return commonWordsMap[minCommonWordsCount];
  }
}

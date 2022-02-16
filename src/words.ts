/**
 * Words utilities
 */

import { getCommonPrefix } from './utils';

export function getCommonWords(words1: string[], words2: string[], minLength = 4) {
  const commonWords = [];
  for (const word1 of words1) {
    for (const word2 of words2) {
      const commonPrefix = getCommonPrefix(word1, word2);
      // eslint-disable-next-line max-depth
      if (commonPrefix.length >= minLength) commonWords.push(commonPrefix);
    }
  }
  return commonWords;
}

export function getWords(str: string) {
  return str.match(/[a-zа-яё]+/ig) || [];
}

export function getLongWords(str: string, minLength = 4) {
  return getWords(str).filter(word => word.length >= minLength);
}

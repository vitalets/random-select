/**
 * Words utilities
 */

export function getCommonWordsCount(words1: string[], words2: string[], minCommonChars = 4) {
  let count = 0;
  for (const word1 of words1) {
    for (const word2 of words2) {
      const commonCharsCount = getCommonCharsCount(word1, word2);
      if (commonCharsCount >= minCommonChars) count++; // eslint-disable-line max-depth
    }
  }
  return count;
}

function getCommonCharsCount(word1: string, word2: string) {
  const l = Math.min(word1.length, word2.length);
  let i = 0;
  while (i < l && word1.charAt(i) === word2.charAt(i)) i++;
  return i;
}

export function getWords(str: string) {
  return str.match(/[a-zа-яё]+/ig) || [];
}

export function getLongWords(str: string, minLength = 4) {
  return getWords(str).filter(word => word.length >= minLength);
}

// const getLongWords = str => getWords(str).filter(word => word.length >= 4);

// module.exports = {
//   getCommonWordsCount,
//   getLongWords,
// };

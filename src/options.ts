export interface RandomSelectOptions {
  /**
   * When selecting next item lib can calc common words with last used value,
   * and select item having minimal common words.
   * This option sets minimal length of word to consider "common".
   */
  commonWordsMinLength?: number;
  /**
   * Length of item substring used for key generation.
   */
  keyItemLength?: number;
  /**
   * Disable random for testing purposes.
   */
  disableRandom?: boolean;
}

export const defaults = {
  commonWordsMinLength: 4,
  keyItemLength: 10,
  disableRandom: false,
};

export default class OutputPlugin {
  /**
   * @abstract
   * @param {Tag} tag Tag which is used.
   * @param {string} text Text to output.
   */
  write (tag, text) { }

  /**
   * Format string.
   * @abstract
   * @param {string} text
   * @param {*[]|array} args Arguments.
   */
  format (text, ...args) {}
}

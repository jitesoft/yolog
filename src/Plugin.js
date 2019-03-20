/** @abstract */
export default class Plugin {
  /**
   * Method called when a log message is intercepted and the plugin is listening to the given tag.
   *
   * @param {String} tag Tag which was used when logging the message.
   * @param {Number} timestamp Timestamp (in ms) when the log was intercepted by the Yolog instance.
   * @param {String} message
   * @param {...any} [args] Argument list to pass to plugins for formatting.
   *
   * @abstract
   */
  log (tag, timestamp, message, ...args) {}

  /**
   * Getter to fetch what tags that the plugin is listening to.
   *
   * @abstract
   * @return {Array<String>}
   */
  get tags () {
    return [];
  }

  /**
   * Getter to fetch the plugin priority, depending on priority, it will be invoked
   * before or after other plugins.
   *
   * @abstract
   * @return {Number}
   */
  get priority () { return -1; }
}

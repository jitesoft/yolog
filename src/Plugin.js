/** @abstract */
export default class Plugin {
  #priority = 0;
  #tags = {
    'debug': true,
    'info': true,
    'warning': true,
    'error': true,
    'critical': true,
    'alert': true,
    'emergency': true
  };

  /**
   * Method called when a log message is intercepted and the plugin is listening to the given tag.
   *
   * @param {String} tag Tag which was used when logging the message.
   * @param {Number} timestamp Timestamp (in ms) when the log was intercepted by the Yolog instance.
   * @param {String} message
   * @return Promise<void>
   * @abstract
   */
  async log (tag, timestamp, message) {
    throw {
      name: 'InvalidMethodException',
      message: 'This method is abstract and should not be called.'
    };
  }

  /**
   * Set state of a given tag for the plugin.
   * If value is omitted, the state will be toggled.
   *
   * @param {String} tag
   * @param {Boolean} [state]
   */
  set (tag, state) {
    state = state !== null ? state : !this.get(tag);
    this.#tags[tag] = state;
  }

  /**
   * Get state of given tag for the plugin.
   *
   * @param {String} tag
   * @return {Boolean}
   */
  get (tag) {
    return this.#tags[tag];
  }

  /**
   * Getter to fetch a list of all available tags.
   *
   * @return {Array<string>}
   */
  get available () {
    return Object.keys(this.#tags);
  }

  /**
   * Getter to fetch what tags that the plugin is listening to.
   *
   * @return {Array<String>}
   */
  get active () {
    const result = [];
    for (let [tag, state] of this.#tags) {
      if (state) {
        result.push(tag);
      }
    }

    return result;
  }


  /**
   * Setter for plugin priority, depending on priority it will be invoked before or after other plugins.
   *
   * @param value
   */
  set priority (value) {
    this.#priority = value;
  }

  /**
   * Getter to fetch the plugin priority, depending on priority, it will be invoked before or after other plugins.
   *
   * @return {Number}
   */
  get priority () {
    return this.#priority;
  }
}


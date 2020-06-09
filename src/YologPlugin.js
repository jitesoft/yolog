/** @abstract */
export default class YologPlugin {
  static id = 0;

  #id = YologPlugin.id++;

  get id () {
    return this.#id;
  }

  #tags = {
    debug: {
      enabled: true,
      error: true
    },
    info: {
      enabled: true,
      error: true
    },
    warning: {
      enabled: true,
      error: true
    },
    error: {
      enabled: true,
      error: true
    },
    critical: {
      enabled: true,
      error: true
    },
    alert: {
      enabled: true,
      error: true
    },
    emergency: {
      enabled: true,
      error: true
    }
  };

  #errors = true;

  /**
   * Disable internal error passing to the underlying plugin or event handler.
   * If tag name/s are omitted, the setting will be global.
   *
   * @param {...string} [tag] Optional tags to toggle.
   * @return {YologPlugin} This
   */
  disableError (...tag) {
    if (tag.length === 0) {
      this.#errors = false;
      return this;
    }

    tag.forEach((tag) => {
      if (this.#tags[tag.toLowerCase()]) {
        this.#tags[tag.toLowerCase()].error = false;
      }
    });
  }

  /**
   * Enable internal error passing to the underlying plugin or event handler.
   * If tag name/s are omitted, the setting will be global.
   *
   * @param {...string} [tag] Optional tags to toggle.
   * @return {YologPlugin} This
   */
  enableError (...tag) {
    if (tag.length === 0) {
      this.#errors = true;
      return this;
    }

    tag.forEach((tag) => {
      if (this.#tags[tag.toLowerCase()]) {
        this.#tags[tag.toLowerCase()].error = true;
      }
    });
  }

  /**
   * Check if error for given tag is enabled.
   *
   * @internal
   * @param {string} tag
   * @return {boolean}
   */
  errorIsEnabled (tag) {
    return !(!this.#errors || this.#tags[tag.toLowerCase()].error === false);
  }

  /**
   * Method called when a log message is intercepted and the plugin is listening to the given tag.
   *
   * @param {String} tag       Tag which was used when logging the message.
   * @param {Number} timestamp Timestamp (in ms) when the log was intercepted by the Yolog instance.
   * @param {String} message   Message that is passed to the plugin.
   * @param {Error} error      Error generated in the logger to be possible to use for call stack or for other reasons.
   * @return Promise<void>
   * @abstract
   */
  async log (tag, timestamp, message, error) {
    /* istanbul ignore next */
    throw new Error('This method is abstract and should not be called.');
  }

  /**
   * Set state of a given tag for the plugin.
   * If value is omitted, the state will be toggled.
   *
   * @param {String} tag
   * @param {Boolean} [state]
   * @return {YologPlugin} Self.
   */
  set (tag, state = null) {
    tag = tag.toLowerCase();
    if (!(tag in this.#tags)) {
      this.#tags[tag] = {
        enabled: state === null ? true : state,
        error: true
      };
      return this;
    }

    this.#tags[tag.toLowerCase()].enabled = state !== null ? state : !this.get(tag);
    return this;
  }

  /**
   * Get state of given tag for the plugin.
   *
   * @param {String} tag
   * @return {Boolean}
   */
  get (tag) {
    return this.#tags[tag.toLowerCase()]?.enabled ?? undefined;
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
    return Object.keys(this.#tags).filter(this.get.bind(this));
  }
}

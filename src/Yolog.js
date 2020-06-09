import YologPlugin from './YologPlugin';
import { EventHandler, Event } from '@jitesoft/events';
import sprintf from '@jitesoft/sprintf';

/**
 * @class Yolog
 *
 * Main class for the Yolog logging helper.
 */
export default class Yolog {
  /** @type {EventHandler} */
  #eventHandler;

  /** @type {Array<YologPlugin>} */
  #plugins;

  /** @type {Object} */
  #tags;

  /** @type {Boolean} */
  #errors = true;

  #timestamp = () => {
    return (new Date()).getTime();
  };

  #formatter = async (message, ...args) => {
    return Promise.resolve(sprintf(message, ...args));
  };

  constructor (plugins = [], tags = {
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
  }) {
    this.#eventHandler = new EventHandler();

    // Just to make sure backwards compatibility is ensured.
    for (const tag in tags) {
      tags[tag] = (typeof tags[tag] === 'object') ? tags[tag] : {
        enabled: tags[tag],
        error: true
      };
    }

    this.#tags = tags;
    this.#plugins = plugins;
  }

  /**
   * Disable internal error passing to the underlying plugin or event handler.
   * If tag name/s are omitted, the setting will be global.
   *
   * @param {...string} [tag] Optional tags to toggle.
   * @return {Yolog} This
   */
  disableError (...tag) {
    if (!tag || tag.length === 0) {
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
   * @return {Yolog} This
   */
  enableError (...tag) {
    if (!tag || tag.length === 0) {
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
   * Use the logger as an event handler and add a callback that will fire on a specific tag.
   *
   * @param {String} tag Tag to listen for.
   * @param {Function} handler Handler to call.
   * @param {Number} priority Priority for the event handlers internal sorting.
   * @return {Number} Handler id, can be used to turn the handler off if the callback is not available.
   */
  on (tag, handler, priority) {
    return this.#eventHandler.on(tag, handler, priority);
  }

  /**
   * Remove a listener from a given tag.
   *
   * @param {String} tag Tag to remove the specific handler from.
   * @param {(Number|Function)} handler Handler as callback or ID.
   * @return {Boolean}
   */
  off (tag, handler) {
    return this.#eventHandler.off(tag, handler);
  }

  /**
   * Use the logger as an event handler and add a callback that will fire one time on a specific tag.
   *
   * @param {String} tag Tag to listen for.
   * @param {Function} handler Handler to call.
   * @param {Number} [priority] Priority for the event handlers internal sorting.
   * @return {Number} Handler id, can be used to turn the handler off if the callback is not available.
   */
  once (tag, handler, priority) {
    return this.#eventHandler.once(tag, handler, priority);
  }

  /**
   * Change the currently used timestamp method.
   * Defaults to `() => { return (new Date()).getTime() };`
   *
   * @param {Function} func Function to use.
   * @return {Yolog} Self.
   */
  setTimestampFunction (func) {
    this.#timestamp = func;
    return this;
  }

  /**
   * Get a list of tags that are active.
   *
   * @return {Array<String>}
   */
  get active () {
    return Object.keys(this.#tags).filter(this.get.bind(this));
  }

  /**
   * Get all available tags.
   *
   * @return {Array<String>}
   */
  get available () {
    return Object.keys(this.#tags);
  }

  /**
   * Set a tag state to active or not active in the Yolog instance.
   * If state is omitted, the tag will be toggled to the negative of the current state.
   *
   * @param {String} tag Tag name.
   * @param {Boolean} [state] State to set the tag to.
   * @return {Yolog} self
   */
  set (tag, state = null) {
    tag = tag.toLowerCase();
    if (tag in this.#tags) {
      this.#tags[tag].enabled = (state === null ? !this.get(tag) : state);
      return this;
    }
    this.#tags[tag] = {
      enabled: state === null ? false : state,
      error: true // Always default to true.
    };
    return this;
  }

  /**
   * Get state of a specific tag in the Yolog instance.
   *
   * @param {String} tag
   * @return {Boolean|undefined}
   */
  get (tag) {
    tag = tag.toLowerCase();
    return this.#tags[tag]?.enabled ?? undefined;
  }

  /**
   * Get list of plugins in the Yolog instance.
   *
   * @return {Array<Plugin>}
   */
  get plugins () {
    return this.#plugins;
  }

  /**
   * Add a plugin to the current Yolog instance.
   *
   * @param {YologPlugin} plugin
   * @return {Yolog} self
   */
  addPlugin (plugin) {
    this.#plugins.push(plugin);
    this.#plugins.sort((p, p2) => p.priority - p2.priority);
    return this;
  }

  /**
   * Remove a plugin from current Yolog instance.
   *
   * @param {YologPlugin} plugin
   * @return {Yolog} self
   */
  removePlugin (plugin) {
    const index = this.#plugins.findIndex((p) => p.id === plugin.id);
    if (index !== -1) {
      this.#plugins.splice(index, 1);
    }
    return this;
  }

  #log = async (tag, message, ...args) => {
    if ((this.#tags[tag]?.enabled ?? true) === false) {
      return;
    }

    if (args.length > 0) {
      message = await this.#formatter(message, ...args);
    }

    let error = null;
    if (this.#errors && (this.#tags[tag]?.error ?? true)) {
      error = new Error(message);
    }

    const time = this.#timestamp();
    const promises = this.#plugins.map((plugin) => {
      if (plugin.get(tag) === true) {
        return plugin.log(tag, time, message, plugin.errorIsEnabled(tag) ? error : null);
      }
      return Promise.resolve();
    });

    // Fire the events without waiting on the promises to resolve.
    this.#eventHandler.emitAsync(tag, new Event({
      message: message,
      arguments: args,
      timestamp: time,
      tag: tag,
      errorObject: error
    })).catch(() => { /* Should not happen. */ });

    await Promise.allSettled(promises);
  };

  // region Log methods.

  /**
   * Call a custom tag not already defined.
   *
   * @param {String} tag Tag name.
   * @param {String} message Message to log.
   * @param {...any} [args] Argument list to pass to plugins for formatting.
   */
  async custom (tag, message, ...args) {
    await this.#log(tag, message, ...args);
  }

  /**
   * Log a debug message.
   *
   * @param {String} message Message to log.
   * @param {...any} [args] Argument list to pass to plugins for formatting.
   */
  async debug (message, ...args) {
    await this.#log('debug', message, ...args);
  }

  /**
   * Log a info message.
   *
   * @param {String} message Message to log.
   * @param {...any} [args] Argument list to pass to plugins for formatting.
   */
  async info (message, ...args) {
    await this.#log('info', message, ...args);
  }

  /**
   * Log a warning message.
   *
   * @param {String} message Message to log.
   * @param {...any} [args] Argument list to pass to plugins for formatting.
   */
  async warning (message, ...args) {
    await this.#log('warning', message, ...args);
  }

  /**
   * Log an error message.
   *
   * @param {String} message
   * @param {...any} [args] Argument list to pass to plugins for formatting.
   */
  async error (message, ...args) {
    await this.#log('error', message, ...args);
  }

  /**
   * Log a critical message.
   *
   * @param {String} message Message to log.
   * @param {...any} [args] Argument list to pass to plugins for formatting.
   */
  async critical (message, ...args) {
    await this.#log('critical', message, ...args);
  }

  /**
   * Log an alert message.
   *
   * @param {String} message Message to log.
   * @param {...any} [args] Argument list to pass to plugins for formatting.
   */
  async alert (message, ...args) {
    await this.#log('alert', message, ...args);
  }

  /**
   * Log an emergency message.
   *
   * @param {String} message Message to log.
   * @param {...any} [args] Argument list to pass to plugins for formatting.
   */
  async emergency (message, ...args) {
    await this.#log('emergency', message, ...args);
  }

  // endregion
}

const logger = new Yolog();
export {
  Yolog, YologPlugin, logger, YologPlugin as Plugin
};

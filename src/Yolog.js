import Plugin from './Plugin';
import { EventHandler, Event } from '@jitesoft/events';
import sprintf from '@jitesoft/sprintf';

/**
 * @class Yolog
 *
 * Main class for the Yolog logging helper.
 */
export default class Yolog {
  #eventHandler;

  /** @type {Array<Plugin>} */
  #plugins;

  /** @type {Object} */
  #tags;

  #timestamp = () => {
    return (new Date()).getTime();
  };

  #formatter = (message, ...args) => {
    return sprintf(message, ...args);
  };

  constructor (plugins = [], tags = { debug: true, info: true, warning: true, error: true, critical: true, alert: true, emergency: true }) {
    this.#eventHandler = new EventHandler();
    this.#tags = tags;
    this.#plugins = plugins;
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
   */
  setTimestampFunction (func) {
    this.#timestamp = func;
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
   */
  set (tag, state = null) {
    this.#tags[tag.toLowerCase()] = state !== null ? state : !this.get(tag);
  }

  /**
   * Get state of a specific tag in the Yolog instance.
   *
   * @param {String} tag
   * @return {Boolean}
   */
  get (tag) {
    return this.#tags[tag.toLowerCase()];
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
   * @param {Plugin} plugin
   */
  addPlugin (plugin) {
    this.#plugins.push(plugin);
    this.#plugins.sort((p, p2) => p.priority - p2.priority);
  }

  /**
   * Remove a plugin from current Yolog instance.
   *
   * @param {Plugin} plugin
   */
  removePlugin (plugin) {
    const index = this.#plugins.findIndex((p) => p.id === plugin.id);
    if (index !== -1) {
      this.#plugins.splice(index, 1);
    }
  }

  #log = async (tag, message, ...args) => {
    const error = new Error();
    if (tag in this.#tags && this.#tags[tag] === false) {
      return;
    }

    if (!!args && args.length > 0) {
      message = this.#formatter(message, ...args);
    }

    const time = this.#timestamp();
    const promises = this.#plugins.map((plugin) => {
      if (plugin.get(tag) === true) {
        return plugin.log(tag, time, message, error);
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
  Yolog, Plugin, logger
};

import Plugin from './Plugin';
import { EventHandler, Event } from '@jitesoft/events';

/**
 * @class Yolog
 *
 * Main class for the Yolog logging helper.
 */
export default class Yolog {
  #eventHandler = new EventHandler();
  /** @type {Array<Plugin>} */
  #plugins = [];
  #timestamp = () => { return (new Date()).getTime() };
  #activeTags = { };

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
   * @return {Array}
   */
  get active () {
    const result = [];
    for (let [tag, state] of this.#activeTags) {
      if (state) {
        result.push(tag);
      }
    }

    return result;
  }

  /**
   * Set a tag state to active or not active in the Yolog instance.
   * If state is omitted, the tag will be toggled to the negative of the current state.
   *
   * @param {String} tag Tag name.
   * @param {Boolean} [state] State to set the tag to.
   */
  set (tag, state = null) {
    state = state ?? !this.get(tag);
    this.#activeTags[tag] = state;
  }

  /**
   * Get state of a specific tag in the Yolog instance.
   *
   * @param {String} tag
   * @return {Boolean}
   */
  get (tag) {
    return this.#activeTags[tag];
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
    const index = this.#plugins.indexOf(plugin);
    if (index !== -1) {
      this.#plugins = this.#plugins.splice(index, 1);
    }
  }

  #log (tag, message, ...args) {
    if (!this.#activeTags[tag]) {
      return;
    }

    const time = this.#timestamp();
    this.#plugins.forEach((plugin) => {
      if (plugin.tags.includes(tag)) {
        plugin.log(tag, time, message, ...args);
      }
    });

    if (this.#eventHandler._listeners.length > 0) {
      this.#eventHandler.emit(tag, new Event({
        message: message,
        arguments: args,
        timestamp: time,
        tag: tag
      }));
    }
  }

  //region Log methods.

  /**
   * Log a debug message.
   *
   * @param {String} message
   * @param {...any} [args] Argument list to pass to plugins for formatting.
   */
  debug (message, ...args) {
    this.#log('debug', message, ...args);
  }

  /**
   * Log a info message.
   *
   * @param {String} message
   * @param {...any} [args] Argument list to pass to plugins for formatting.
   */
  info (message, args) {
    this.#log('info', message, args);
  }

  /**
   * Log a warning message.
   *
   * @param {String} message
   * @param {...any} [args] Argument list to pass to plugins for formatting.
   */
  warning (message, args) {
    this.#log('warning', message, args);
  }

  /**
   * Log an error message.
   *
   * @param {String} message
   * @param {...any} [args] Argument list to pass to plugins for formatting.
   */
  error (message, args) {
    this.#log('error', message, args);
  }

  /**
   * Log a critical message.
   *
   * @param {String} message
   * @param {...any} [args] Argument list to pass to plugins for formatting.
   */
  critical (message, args) {
    this.#log('critical', message, args);

  }

  /**
   * Log an alert message.
   *
   * @param {String} message
   * @param {...any} [args] Argument list to pass to plugins for formatting.
   */
  alert (message, args) {
    this.#log('alert', message, args);

  }

  /**
   * Log an emergency message.
   *
   * @param {String} message
   * @param {...any} [args] Argument list to pass to plugins for formatting.
   */
  emergency (message, args) {
    this.#log('emergency', message, args);
  }

  //endregion
}

export {
  Yolog, Plugin
}

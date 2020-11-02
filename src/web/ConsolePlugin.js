import { Plugin } from '../Yolog';

export default class ConsolePlugin extends Plugin {
  #colors = {
    error: { call: 'error', color: 'color: red;' },
    critical: { call: 'error', color: 'color: red; text-decoration: underline;' },
    alert: { call: 'error', color: 'color: red; text-decoration: italic;' },
    emergency: { call: 'error', color: 'color: red; text-decoration: underline;' },
    warning: { call: 'warn', color: 'color: yellow;' },
    notice: { call: 'log', color: 'color: yellow' },
    debug: { call: 'log', color: 'color: lightblue;' },
    info: { call: 'info', color: '' }
  };

  #formatDate = (date) => date.toLocaleString();

  /**
   * Set method used to format date with.
   * Defaults to `date.toLocaleString()`.
   *
   * @param {function} func Callback to use.
   */
  setDateFormatMethod (func) {
    this.#formatDate = func;
  }

  async log (tag, timestamp, message, error) {
    await new Promise((resolve, reject) => {
      const str = `%c[${tag.toUpperCase()}] (${this.#formatDate(new Date())}): ${message}`;
      window.console[this.#colors[tag].call](str, this.#colors[tag].color);
      if (error !== null) {
        window.console[this.#colors[tag].call](error.stack);
      }

      resolve();
    });
  }
}

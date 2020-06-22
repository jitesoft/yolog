import { Plugin } from '../Yolog';

export default class ConsolePlugin extends Plugin {
  #colors = {
    error: { call: 'error', color: 'color: red;' },
    critical: { call: 'error', color: 'color: red; text-decoration: underline;' },
    alert: { call: 'error', color: 'color: red; text-decoration: italic;' },
    emergency: { call: 'error', color: 'color: red; text-decoration: underline;' },
    warning: { call: 'warn', color: 'color: yellow;' },
    debug: { call: 'log', color: 'color: lightblue;' },
    info: { call: 'info', color: '' }
  };

  async log (tag, timestamp, message, error) {
    await new Promise((resolve, reject) => {
      const str = `%c[${tag.toUpperCase()}] (${(new Date()).toLocaleString()}): ${message}`;
      window.console[this.#colors[tag].call](str, this.#colors[tag].color);
      if (error !== null) {
        window.console[this.#colors[tag].call](error.stack);
      }

      resolve();
    });
  }
}

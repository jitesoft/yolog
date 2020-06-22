import { Plugin } from '../Yolog';

export default class ConsolePlugin extends Plugin {
  #colors = {
    error: { call: 'stdout', color: '0;31' },
    critical: { call: 'stdout', color: '3;31' },
    alert: { call: 'stdout', color: '1;31' },
    emergency: { call: 'stdout', color: '1;31' },
    warning: { call: 'stdout', color: '0;33' },
    debug: { call: 'stdout', color: '0;34' },
    info: { call: 'stdout', color: '0;37' }
  };

  #nl = process.platform === 'win32' ? '\r\n' : '\n';
  #color = true;

  /**
   * Change the console plugin to use or not use colors in output.
   * @param {boolean} state
   */
  set color (state) {
    this.#color = state;
  }

  /**
   * Check weather the console plugin uses colors or not.
   * @return {boolean}
   */
  get color () {
    return this.#color;
  }

  /**
   * @param {boolean} disableColor Disables colors in output.
   */
  constructor (disableColor = false) {
    super();
    this.#color = !disableColor;
  }

  async log (tag, timestamp, message, error) {
    let stack = '';
    if (error !== null) {
      stack = '\n' + error.stack.split('\n').map(s => s.trim()).join('\n\t');
    }

    await new Promise((resolve, reject) => {
      if (!this.color) {
        process[this.#colors[tag].call].write(
          `[${tag.toUpperCase()}] (${(new Date(timestamp)).toLocaleString()}): ${message}${stack}${this.#nl}`,
          'UTF-8',
          (err) => err ? reject(err) : resolve()
        );
      } else {
        process[this.#colors[tag].call].write(
          `\u001b[${this.#colors[tag].color}m[${tag.toUpperCase()}] ` +
          `(${(new Date(timestamp)).toLocaleString()}): ${message}\u001b[0m${stack}${this.#nl}`,
          'UTF-8',
          (err) => err ? reject(err) : resolve()
        );
      }
    });
  }
}

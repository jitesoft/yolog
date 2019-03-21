import { Plugin } from '../Yolog';
import { format } from 'util';

export default class ConsolePlugin extends Plugin {
  #colors = {
    error:     { call: 'stdout', color: '0;31' },
    critical:  { call: 'stdout', color: '3;31' },
    alert:     { call: 'stdout', color: '1;31' },
    emergency: { call: 'stdout', color: '1;31' },
    warning:   { call: 'stdout', color: '0;33' },
    debug:     { call: 'stdout', color: '0;34' },
    info:      { call: 'stdout', color: '0;37' }
  };
  #nl = process.platform === 'win32' ? '\r\n' : '\n';

  async log (tag, timestamp, message) {
    await new Promise((resolve, reject) => {
      process[this.#colors[tag].call].write(
        `\u001b[${this.#colors[tag].color}m[${tag.toUpperCase()}] (${(new Date(timestamp)).toLocaleString()}): ${message}\u001b[0m${this.#nl}`,
        'UTF-8',
        (err) => err ? reject(err) : resolve()
      );
    });
  }
}

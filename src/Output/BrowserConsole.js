import OutputPlugin from '../Common/OutputPlugin';
import Utils from 'util';

export default class BrowserConsole extends OutputPlugin {
  write (tag, text) {
    console.log(text);
  }

  format (text, ...args) {
    return Utils.format(text, ...args);
  }
}

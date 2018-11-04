import OutputPlugin from '../Common/OutputPlugin';

export default class NodeConsole extends OutputPlugin {
  write (tag, text) {
    console.log(text);
  }
}

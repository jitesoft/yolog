import { Yolog, Plugin } from '../Yolog';
import ConsolePlugin from './ConsolePlugin';

const logger = new Yolog([new ConsolePlugin()]);
export default logger;

export {
  logger,
  ConsolePlugin,
  Plugin,
  Yolog
};

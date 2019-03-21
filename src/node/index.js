import { Yolog, Plugin } from '../Yolog';
import ConsolePlugin from './ConsolePlugin';

const logger = new Yolog();
logger.addPlugin(new ConsolePlugin());

export default logger;

export {
  logger,
  ConsolePlugin,
  Plugin,
  Yolog
};

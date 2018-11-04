import Yolog from './Common/Yolog';
import Palette from './node/Palette';
import Tag from './Common/Tag';

const format = '\\033[{style};3{color}m{text}\\033[0m'; // style,color\text

let tags = [
  new Tag('debug', format, Palette.white, Palette.normal)
];

export default new Yolog(tags);

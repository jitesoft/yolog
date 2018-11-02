import Colors from './Output/Colors';
import Util from 'util';

let arg = process.env === 'web' ? '%c' : '%s';



function print(tag, str, args, yolog) {
    tag = tag.toLowerCase();
    let color = yolog.tags[tag];

    // Color tag. Text, Color cyan, date, caller, text.
    let out = `${arg}${tag}${arg}(${yolog.getDate})${arg}`;
    return util.format(out, color, Colors.Cyan, Colors.White);
}

class Yolog {

    getDate() {
        return new Date();
    }

    debug(str, args) {
        this.tags = {
            trace:   { color: Colors.Cyan },
            debug:   { color: Colors.Blue },
            error:   { color: Colors.Red },
            warning: { color: Colors.Yellow },
            info:    { color: Colors.White },
            todo:    { color: Colors.Green }
        }

    }

    error(str, args) {

    }

    warning(str, args) {}

    info(str, args) {}

    todo(str, args) {}
}

export default Yolog;

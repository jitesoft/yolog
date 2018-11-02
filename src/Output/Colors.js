let web  = {
    black: 'color: black;',
    red: 'color: red;',
    green: 'color: green;',
    yellow: 'color: yellow;',
    blue: 'color: blue;',
    purple: 'color: purple;',
    cyan: 'color: cyan;',
    white: 'color: white;'
};

let node = {
    black:  '0',
    red:    '1',
    green:  '2',
    yellow: '3',
    blue:   '4',
    purple: '5',
    cyan:   '6',
    white:  '7'
};

let colors = (process.env === 'web') ? web  : node;

/**
 * A single color object.
 */
class Color {

    /**
     * Color code.
     *
     * @return {string}
     */
    get Code() {
        return this.code;
    }

    /**
     * Name of the color.
     *
     * @return {string}
     *
     */
    get Name() {
        return this.name;
    }

    /**
     * @param {string} code
     * @param {string} name
     */
    constructor(code, name) {
        this.code = code;
        this.name = name;
        this.arg  = arg;
        this.prototype.toString = () => {
            return this.code;
        }
    }

}

export default {
    Black:  new Color('black', colors.black),
    Red:    new Color('red', colors.red),
    Green:  new Color('green', colors.green),
    Yellow: new Color('yellow', colors.yellow),
    Blue:   new Color('blue', colors.blue),
    Purple: new Color('purple', colors.purple),
    Cyan:   new Color('cyan', colors.cyan),
    White:  new Color('white', colors.white)
};


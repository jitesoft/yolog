const colors = {
    black:  '0m',
    red:    '1m',
    green:  '2m',
    yellow: '3m',
    blue:   '4m',
    purple: '5m',
    cyan:   '6m',
    white:  '7m'
};

const reset = '033[0m';


class Color {

    constructor () {
        this.currentColor = colors.black;
        this.currentStyle = styles.normal;
    }

    set Style(style) {
        if (!style in styles) {
            throw new Error(`Failed to set the style, style ${style} is not a valid style.`);
        }

        this.currentStyle = styles[style];
    }

    get Style() {
        return Object.keys(styles).find(key => styles[key] === this.currentStyle);
    }


    get Color() {
        return Object.keys(colors).find(key => colors[key] === this.currentColor);
    }

    set Color(color) {
        if (!color in colors) {
            throw new Error(`Failed to set the style, style ${color} is not a valid color.`);
        }

        this.currentColor = colors[color];
    }

    get Colors() {
        return colors.keys();
    }

    get Styles() {
        return styles.keys();
    }

    get Current() {
        return `\\003[${this.currentStyle}${this.currentColor}`;
    }

    reset () {
        this.currentColor = reset;
    }

}

export default Color;
export Colors;
export Styles;

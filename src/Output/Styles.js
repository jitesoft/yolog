const node = {
    normal:        '0;3',
    bold:          '1;3',
    dim:           '2;3',
    italic:        '3;3',
    underline:     '4;3',
    inverse:       '7;3',
    hidden:        '8;3',
    strikethrough: '9;3'
};


const web = {
    normal:        '',
    bold:          'font-weight: bold;',
    dim:           '',
    italic:        'font-style: italic;',
    underline:     'text-decoration: underline;',
    inverse:       '',
    hidden:        'display: none;',
    strikethrough: 'text-decoration: line-through;'
};

let styles = (process.env === 'web') ? web  : node;

class Style {

    get Name() {
        return this.name;
    }

    get Code() {
        return this.code;
    }

    /**
     *
     * @param {string} name
     * @param {string} code
     */
    constructor(name, code) {
        this.name = name;
        this.code = code;

        this.prototype.toString = () => {
            return this.code;
        };
    }

}

export default {
    Normal: new Style('normal', styles.normal),
    Bold: new Style('bold', styles.bold),
    Dim: new Style('dim', styles.dim),
    Italic: new Style('italic', styles.italic),
    Underline: new Style('underline', styles.underline),
    Inverse: new Style('inverse', styles.inverse),
    Hidden: new Style('hidden', styles.hidden),
    StrikeThrough: new Style('strikethrough', styles.strikethrough),
};

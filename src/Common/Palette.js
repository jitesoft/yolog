import Color from './Color';
import Style from './Style';

export {
  Color,
  Style,
  Palette
};

/**
 * @abstract
 */
export default class Palette {

  _availableColors = [];
  _availableStyles = [];
  _styles = {};
  _colors = {};


  /**
   *
   * @param {Color|Style|array} args List of colors and styles.
   */
  constructor (...args) {
    for (let i=0, val = args[i];i<args.length;i++) {
      if (val instanceof Color) {
        this._colors[val.name] = val;
        this._availableColors.push(val.name);
      } else {
        this._styles[val.name] = val;
        this._availableStyles.push(val.name);
      }
    }
  }


  static colorize (color, text) {}

  get availableColors () {

  }

  get black () {
    return this._colors['black'];
  }

  get red () {
    return this._colors['red'];
  }

  get green () {
    return this._colors['green'];
  }

  get yellow () {
    return this._colors['yellow'];
  }

  get blue () {
    return this._colors['blue'];
  }

  get purple () {
    return this._colors['purple'];
  }

  get cyan () {
    return this._colors['cyan'];
  }

  get white () {
    return this._colors['white'];
  }

  get normal() {}
  get bold () {}
  get italic () {}
  get underline () {}
  get strikethrough () {}

}

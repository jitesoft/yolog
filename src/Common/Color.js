/**
 * Struct for color data.
 */
export default class Color {
  _name;
  _code;

  constructor (name, code) {
    this._name = name;
    this._code = code;
  }

  /**
   * Name of the color.
   * @return {string}
   */
  get name () {
    return this._name;
  }

  /**
   * Color code.
   * @return {string|int}
   */
  get code () {
    return this._code;
  }

}

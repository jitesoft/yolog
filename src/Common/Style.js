/**
 * Struct for style data.
 */
export default class Style {
  _name;
  _code;

  constructor (name, code) {
    this._name = name;
    this._code = code;
  }

  /**
   * Style name.
   * @return {string}
   */
  get name () {
    return this._name;
  }

  /**
   * style code.
   * @return {string|int}
   */
  get code () {
    return this._code;
  }
}

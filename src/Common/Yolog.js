import { InvalidArgumentError } from './Exceptions/InvalidArgumentError';

class Yolog {
  _tags = [];
  _palette = null;
  _dateFunction = () => (new Date()).toLocaleString();
  _showFunctionName = false;

  constructor (palette, tags) {
    this._tags = tags;
    this._palette = palette;
    this._showFunctionName = false;
  }

  /**
   * Change the method used to produce date output.
   *
   * Example:
   * <pre>
   *   yolog.dateFunction = () => (new Date()).toLocaleString();
   * </pre>
   * @param value
   * @return {Yolog} Self.
   */
  set dateFunction (value) {
    this._dateFunction = value;
    return this;
  }

  /**
   *
   * @param value
   * @return {Yolog} Self.
   */
  set showFunctionName (value) {
    this._showFunctionName = value;
    return this;
  }

  /**
   * Get a tag state
   * @param {string} tag Tag to check state on.
   * @return {boolean} True if active, false if not.
   * @throws {InvalidArgumentError}
   */
  get (tag) {}

  /**
   * Set state to active on one or many tags.
   * @param {array|string|string[]} tag Tag or tags to activate.
   * @return {Yolog} Self.
   */
  on (...tag) {return this; }

  /**
   * Sets state to inactive on one or many tags.
   * @param {array|string|string[]} tag Tag or tags to inactivate.
   * @param tag
   * @return {Yolog} Self.
   */
  off (...tag) { return this; }

  /**
   * Change the color of a given tag.
   * @param {string} tag Tag to change color of.
   * @param {Color} color Color to change to.
   * @return {Yolog} Self
   */
  color (tag, color) {return this; }

  /**
   * Change the style of given tag.
   * @param {string} tag Tag to change style for.
   * @param {Style} style Style to change to.
   * @return {Yolog} Self
   */
  style (tag, style) {return this; }

  /**
   * Output with debug tag.
   * @param {string} text Text to print.
   * @param {...} [args] Argument list to insert into formatted text.
   * @return {Yolog} Self.
   */
  debug (text, ...args) {return this; }

  /**
   * Output with trace tag.
   * @param {string} text Text to print.
   * @param {...} [args] Argument list to insert into formatted text.
   * @return {Yolog} Self.
   */
  trace (text, ...args) {return this; }

  /**
   * Output with error tag.
   * @param {string} text Text to print.
   * @param {...} [args] Argument list to insert into formatted text.
   * @return {Yolog} Self.
   */
  error (text, ...args) {return this; }

  /**
   * Output with alert tag.
   * @param {string} text Text to print.
   * @param {...} [args] Argument list to insert into formatted text.
   * @return {Yolog} Self.
   */
  alert (text, ...args) {return this;}

  /**
   * Output with emergency tag.
   * @param {string} text Text to print.
   * @param {...} [args] Argument list to insert into formatted text.
   * @return {Yolog} Self.
   */
  emergency (text, ...args) {return this;}

  /**
   * Output with warning tag.
   * @param {string} text Text to print.
   * @param {...} [args] Argument list to insert into formatted text.
   * @return {Yolog} Self.
   */
  warning (text, ...args) {return this; }

  /**
   * Output with info tag.
   * @param {string} text Text to print.
   * @param {...} [args] Argument list to insert into formatted text.
   * @return {Yolog} Self.
   */
  info (text, ...args) {return this; }

  exception (error) {return this; }

}

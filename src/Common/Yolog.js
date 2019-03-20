import { InvalidArgumentError } from './Exceptions/InvalidArgumentError';

export default class Yolog {
  _tags = [];
  _plugins = [];
  _palette = null;
  _dateFunction = () => (new Date()).toLocaleString();
  _showFunctionName = false;

  constructor (palette, tags) {
    this._tags = tags;
    this._palette = palette;
    this._showFunctionName = false;
    this._plugins = [];
  }

  /**
   * Set plugin list.
   * @param {array|OutputPlugin[]} plugins
   * @returns {Yolog} Self.
   */
  set plugins (plugins) {
    this._plugins = plugins;
    return this;
  }

  /**
   * Add a plugin to the logger.
   * @param {OutputPlugin} plugin
   * @return {Yolog} Self.
   */
  addPlugin (plugin) {
    this._plugins.push(plugin);
    return this;
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
  get (tag) {
    let t = this.tags.find(t => t.name === tag) ||
    throw new InvalidArgumentError(`${tag} does not exist in tags.`);
    return t.state;
  }

  /**
   * Set state to active on one or many tags.
   * @param {array|string|string[]} tag Tag or tags to activate.
   * @return {Yolog} Self.
   * @throws {InvalidArgumentError}
   */
  on (...tag) {
    tag.forEach((t) => {
      let it = this.tags.find(i => i.name === t) ||
      throw new InvalidArgumentError(`${t} does not exist in tags.`);
      it.state = true;
    });
    return this;
  }

  /**
   * Sets state to inactive on one or many tags.
   * @param {array|string|string[]} tag Tag or tags to inactivate.
   * @param tag
   * @return {Yolog} Self.
   * @throws {InvalidArgumentError}
   */
  off (...tag) {
    tag.forEach((t) => {
      let it = this.tags.find(i => i.name === t) ||
      throw new InvalidArgumentError(`${t} does not exist in tags.`);
      it.state = false;
    });
    return this;
  }

  /**
   * Change the color of a given tag.
   * @param {string} tag Tag to change color of.
   * @param {Color} color Color to change to.
   * @return {Yolog} Self
   */
  color (tag, color) {
    const t = this.tags.find(i => i.name === tag) ||
    throw new InvalidArgumentError(`${t} does not exist in tags.`);
    t.color = color;
    return this;
  }

  /**
   * Change the style of given tag.
   * @param {string} tag Tag to change style for.
   * @param {Style} style Style to change to.
   * @return {Yolog} Self
   */
  style (tag, style) {
    const t = this.tags.find(i => i.name === tag) ||
    throw new InvalidArgumentError(`${t} does not exist in tags.`);
    t.style = style;
    return this;
  }

  async _output (tag, text, ...args) {
    this._plugins.forEach(async (p) => {
      await p.write(tag, p.format(text, args));
    });
    return this;
  }

  /**
   * Output with debug tag.
   * @param {string} text Text to print.
   * @param {...} [args] Argument list to insert into formatted text.
   * @return {Promise} Self.
   */
  async debug (text, ...args) {
    const tag = this._tags.find(t => t.name === 'debug');
    return this._output(tag, text, ...args);
  }

  /**
   * Output with trace tag.
   * @param {string} text Text to print.
   * @param {...} [args] Argument list to insert into formatted text.
   * @return {Yolog} Self.
   */
  async trace (text, ...args) {
    const tag = this._tags.find(t => t.name === 'trace');
    return this._output(tag, text, ...args);
  }

  /**
   * Output with error tag.
   * @param {string} text Text to print.
   * @param {...} [args] Argument list to insert into formatted text.
   * @return {Yolog} Self.
   */
  async error (text, ...args) {
    const tag = this._tags.find(t => t.name === 'error');
    return this._output(tag, text, ...args);
  }

  /**
   * Output with alert tag.
   * @param {string} text Text to print.
   * @param {...} [args] Argument list to insert into formatted text.
   * @return {Yolog} Self.
   */
  async alert (text, ...args) {
    const tag = this._tags.find(t => t.name === 'alert');
    return this._output(tag, text, ...args);
  }

  /**
   * Output with emergency tag.
   * @param {string} text Text to print.
   * @param {...} [args] Argument list to insert into formatted text.
   * @return {Yolog} Self.
   */
  async emergency (text, ...args) {
    const tag = this._tags.find(t => t.name === 'emergency');
    return this._output(tag, text, ...args);
  }

  /**
   * Output with warning tag.
   * @param {string} text Text to print.
   * @param {...} [args] Argument list to insert into formatted text.
   * @return {Yolog} Self.
   */
  async warning (text, ...args) {
    const tag = this._tags.find(t => t.name === 'warning');
    return this._output(tag, text, ...args);
  }

  /**
   * Output with info tag.
   * @param {string} text Text to print.
   * @param {...} [args] Argument list to insert into formatted text.
   * @return {Yolog} Self.
   */
  async info (text, ...args) {
    const tag = this._tags.find(t => t.name === 'info');
    return this._output(tag, text, ...args);
  }

  async exception (error) {
    // TODO: Exception should show trace in {trace} tag.
    const tag = this._tags.find(t => t.name === 'exception');
    return this._output(tag, error.message);
  }

}

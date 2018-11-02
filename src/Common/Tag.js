export default class Tag {
  _format;
  _color;
  _name;
  _style;

  constructor(format, color, name, style) {
    this._color = color;
    this._format = format;
    this._name = name;
    this._style = style;
    this._state = true;
  }

  get format () {
    return this._format;
  }

  get color () {
    return this._color;
  }

  get name () {
    return this._name;
  }

  get style () {
    return this._style;
  }

  get state () {
    return this._state;
  }

  set state (value) {
    this._state = value;
  }
}

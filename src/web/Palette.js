import CommonPalette from '../Common/Palette';

export default class Palette extends CommonPalette {
  get available () {
    return ['black', 'red', 'green', 'yellow', 'blue', 'purple', 'cyan', 'white' ];
  }

  get black () {
    return 'color: black;';
  }

  get red () {
    return 'color: red;';
  }

  get green () {
    return 'color: green;';
  }

  get yellow () {
    return 'color: yellow;';
  }

  get blue () {
    return 'color: blue;';
  }

  get purple () {
    return 'color: purple;';
  }

  get cyan () {
    return 'color: cyan;';
  }

  get white () {
    return 'color: white;';
  }

}

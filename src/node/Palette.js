import CommonPalette, { Color, Style } from '../Common/Palette';

export default class Palette extends CommonPalette {
  constructor () {
    const colorCodes = [0, 1, 2, 3, 4, 5, 6, 7];
    const colorNames = ['black', 'red', 'green', 'yellow', 'blue', 'purple', 'cyan', 'white'];
    const styleCodes = [0, 1, 3, 4, 9];
    const styleNames = ['normal', 'bold', 'italic', 'underline', 'strikethrough'];

    let out = colorNames.map((name, index) => {
      return new Color(name, colorCodes[index]);
    });

    // noinspection JSCheckFunctionSignatures
    out.push(...styleCodes.map((name, index) => {
      return new Style(name, styleNames[index]);
    }));

    for (let i = 0; i < styleCodes.length; i++) {

    }

    super(...out);
  }
}

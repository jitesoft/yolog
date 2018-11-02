import Mocha from 'mocha';
import assert from 'assert';
import Colors from '../src/Colors';


const colorList = { black: '0m', red: '1m', green: '2m', yellow: '3m', blue: '4m', purple: '5m', cyan: '6m', white:'7m'};
const styleList = { normal: '0;3', bold: '1;3', underline: '4;3'};
let colors      = null;

describe('Testing the Color class.', () => {

    beforeEach('setup', () => {
        colors = new Colors();
    });

    describe('Testing default color #constructor().', () => {

        it('Should create a new object with default style "normal" default color "black"', () => {
            let newColors = new Colors();
            assert.equal(newColors.Color, 'black');
            assert.equal(newColors.Style, 'normal');
        });

        it('Should create a new object with default "currentStyle" 0;3 and default "currentColor" 0m.', () => {
            let newColors = new Colors();
            assert.equal(newColors.currentColor, '0m');
            assert.equal(newColors.currentStyle, '0;3');
        });

    });

    describe('Testing setting and getting style #Style.', () => {

        Object.keys(styleList).forEach((key) => {
            let value = styleList[key];
            it(`Should change the current color to ${value}`, () => {
                colors.Style = key;
                assert.equal(colors.Style, key);
                assert.equal(colors.currentStyle, value);
            });
        });

    });

    describe('Testing setting and getting color #Color.', () => {

        Object.keys(colorList).forEach((key) => {
            let value = colorList[key];
            it(`Should change the current color to ${key}.`, () => {
                colors.Color = key;
                assert.equal(colors.Color, key);
                assert.equal(colors.currentColor, value);
            });
        });

    });

    describe('Testing current color and style #Current.', () => {

        Object.keys(styleList).forEach((styleKey) => {
           let s = styleList[styleKey];
            Object.keys(colorList).forEach((colorKey) => {
                let c = colorList[colorKey];
                it(`Should set Current to ${colorKey} & ${styleKey}.`, () => {
                    colors.Color = colorKey;
                    colors.Style = styleKey;
                    assert.equal(colors.Current, `\\003[${s}${c}`);
                });
            });
        });
    });

    describe('Testing reset #reset().', () => {});
    describe('Testing color list #Color.', () => {});
    describe('Testing style list #Styles.', () => {});

});

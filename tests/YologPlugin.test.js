import Plugin from '../src/YologPlugin';

describe('Tests for plugin class.', () => {
  let plugin = null;
  const defaultTags = [
    'debug',
    'info',
    'notice',
    'warning',
    'error',
    'critical',
    'alert',
    'emergency'
  ];

  beforeEach(() => {
    // noinspection JSClosureCompilerSyntax
    plugin = new Plugin(); // Abstract I know, I don't care! :P
  });

  describe('Tests for `set` and `get`', () => {
    test('All tags default to TRUE', () => {
      defaultTags.forEach((tag) => {
        expect(plugin.get(tag)).toBe(true);
      });
    });

    test('Setting tag to false will make only that tag false.', () => {
      plugin.set('debug', false);
      let tag = '';
      for (let i = 0; i < defaultTags.length; i++) {
        tag = defaultTags[i];
        expect(plugin.get(tag)).toBe(i !== 0);
      }
    });

    test('Setting tag to false and then true will make it true.', () => {
      plugin.set('debug', false);
      expect(plugin.get('debug')).toBe(false);
      plugin.set('debug', true);
      expect(plugin.get('debug')).toBe(true);
    });

    test('No arg should toggle.', () => {
      plugin.set('debug', false);
      expect(plugin.get('debug')).toBe(false);
      plugin.set('debug');
      expect(plugin.get('debug')).toBe(true);
      plugin.set('debug');
      expect(plugin.get('debug')).toBe(false);
    });

    test('Setting non-existing tag will create tag.', () => {
      expect(plugin.get('abc')).toBeUndefined();
      plugin.set('abc', false);
      expect(plugin.get('abc')).toBe(false);
    });
  });

  describe('Tests for get `available`', () => {
    test('Available default tags match tags.', () => {
      expect(plugin.available).toEqual(defaultTags);
    });

    test('Adding new tag will include that tag in default tags.', () => {
      expect(plugin.available).toEqual(expect.not.arrayContaining(['abc']));
      plugin.set('abc', true);
      expect(plugin.available).toEqual(expect.arrayContaining(['abc']));
    });
  });

  describe('Tests for get `active`', () => {
    test('Active should by default return all default tags.', () => {
      expect(plugin.active).toEqual(defaultTags);
    });

    test('Setting tag to false should make it not show up in active.', () => {
      plugin.set('debug', false);
      plugin.set('info', false);
      expect(plugin.active).toEqual(expect.not.arrayContaining(['debug', 'info']));
    });
  });
});

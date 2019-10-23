import Yolog from '../src/Yolog';
import Plugin from '../src/Plugin';

class TestPlugin extends Plugin {
  constructor (inner) {
    super();
    this.innerFunction = inner ?? jest.fn();
  }

  async log (...args) {
    this.innerFunction(...args);
    return Promise.resolve();
  }
}

describe('Tests for Yolog class.', () => {
  let logger = null;
  let plugin = null;
  const defaultTags = [
    'debug',
    'info',
    'warning',
    'error',
    'critical',
    'alert',
    'emergency'
  ];

  beforeEach(() => {
    logger = new Yolog();
    plugin = new TestPlugin();
    logger.addPlugin(plugin);
  });

  describe('Tests for Event handling.', () => {
    test('Test that `on` listens to log call.', async () => {
      const fn = jest.fn(e => true);
      logger.on('debug', fn);
      await logger.debug('Hi!');
      expect(fn).toHaveBeenCalled();
    });

    test('Test that `off` (using handle) removes the listener.', async () => {
      const fn = jest.fn(e => true);
      const id = logger.on('debug', fn);
      logger.off('debug', id);
      await logger.debug('Hi!');
      expect(fn).toHaveBeenCalledTimes(0);
    });

    test('Test that `off` (using callback) removes the listener.', async () => {
      const fn = jest.fn(e => true);
      logger.on('debug', fn);
      logger.off('debug', fn);

      await logger.debug('Hi!');
      expect(fn).toHaveBeenCalledTimes(0);
    });

    test('Test that `once` only fire once.', async () => {
      const fn = jest.fn(e => true);
      logger.once('debug', fn);
      await logger.debug('Hi!');
      await logger.debug('Hi!');
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('Tests for get `active`', () => {
    test('Active should by default return all default tags.', () => {
      expect(logger.active).toEqual(defaultTags);
    });

    test('Setting tag to false should make it not show up in active.', () => {
      logger.set('debug', false);
      logger.set('info', false);
      expect(logger.active).toEqual(expect.not.arrayContaining(['debug', 'info']));
    });
  });

  describe('Tests for `set` and `get`', () => {
    test('All tags default to TRUE', () => {
      defaultTags.forEach((tag) => {
        expect(logger.get(tag)).toBe(true);
      });
    });

    test('Setting tag to false will make only that tag false.', () => {
      logger.set('debug', false);
      let tag = '';
      for (let i = 0; i < defaultTags.length; i++) {
        tag = defaultTags[i];
        if (i === 0) {
          expect(logger.get(tag)).toBe(false);
        } else {
          expect(logger.get(tag)).toBe(true);
        }
      }
    });

    test('Setting tag to false and then true will make it true.', () => {
      logger.set('debug', false);
      expect(logger.get('debug')).toBe(false);
      logger.set('debug', true);
      expect(logger.get('debug')).toBe(true);
    });

    test('No arg should toggle.', () => {
      logger.set('debug', false);
      expect(logger.get('debug')).toBe(false);
      logger.set('debug');
      expect(logger.get('debug')).toBe(true);
      logger.set('debug');
      expect(logger.get('debug')).toBe(false);
    });

    test('Setting non-existing tag will create tag.', () => {
      expect(logger.get('abc')).toBeUndefined();
      logger.set('abc', false);
      expect(logger.get('abc')).toBe(false);
    });
  });

  describe('Tests for get `plugins`', () => {
    test('Current instance contains the plugin added in beforeEach.', () => {
      expect(logger.plugins).toHaveLength(1);
      expect(logger.plugins).toEqual(expect.arrayContaining([plugin]));
    });
  });

  describe('Tests for `addPlugin`', () => {
    test('Adding plugin increases plugin count.', () => {
      const fn = jest.fn();
      const fn2 = jest.fn();
      const plugin1 = new TestPlugin(fn);
      const plugin2 = new TestPlugin(fn2);

      logger.addPlugin(plugin1);
      logger.addPlugin(plugin2);

      expect(logger.plugins).toHaveLength(3);
    });

    test('Adding plugin calls all plugins.', async () => {
      const fn = jest.fn();
      const plugin1 = new TestPlugin(fn);

      logger.addPlugin(plugin1);
      await logger.debug('Abc %s', 'hi');

      expect(fn).toHaveBeenCalledTimes(1);
      expect(plugin.innerFunction).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith('debug', expect.any(Number), 'Abc hi', expect.any(Error));
      expect(plugin.innerFunction).toHaveBeenCalledWith('debug', expect.any(Number), 'Abc hi', expect.any(Error));
    });

    test('Only plugin with active tag to be called.', async () => {
      const fn = jest.fn();
      const plugin1 = new TestPlugin(fn);

      logger.addPlugin(plugin1);
      plugin.set('debug', false);
      await logger.debug('Abc %s', 'hi');

      expect(fn).toHaveBeenCalledTimes(1);
      expect(plugin.innerFunction).toHaveBeenCalledTimes(0);
      expect(fn).toHaveBeenCalledWith('debug', expect.any(Number), 'Abc hi', expect.any(Error));
    });

    test('Custom tag is called in plugin.', async () => {
      const fn = jest.fn();
      const plugin1 = new TestPlugin(fn);

      logger.addPlugin(plugin1);
      plugin1.set('weee', true);
      await logger.custom('weee', 'Abc %s', 'hi');

      expect(fn).toHaveBeenCalledTimes(1);
      expect(plugin.innerFunction).toHaveBeenCalledTimes(0);
      expect(fn).toHaveBeenCalledWith('weee', expect.any(Number), 'Abc hi', expect.any(Error));
    });
  });

  describe('Tests for `removePlugin`', () => {
    test('Removing plugin will make plugins return less.', () => {
      expect(logger.plugins).toHaveLength(1);
      logger.removePlugin(plugin);
      expect(logger.plugins).toHaveLength(0);
    });

    test('Removing plugin will make plugin not called.', async () => {
      logger.removePlugin(plugin);
      await logger.debug('Hi!');
      expect(plugin.innerFunction).toHaveBeenCalledTimes(0);
    });
  });
});

# Yolog


[![npm (scoped)](https://img.shields.io/npm/v/@jitesoft/yolog)](https://www.npmjs.com/package/@jitesoft/yolog)
[![Known Vulnerabilities](https://dev.snyk.io/test/npm/@jitesoft/yolog/badge.svg)](https://dev.snyk.io/test/npm/@jitesoft/yolog)
[![pipeline status](https://gitlab.com/jitesoft/open-source/javascript/yolog/badges/master/pipeline.svg)](https://gitlab.com/jitesoft/open-source/javascript/yolog/commits/master)
[![coverage report](https://gitlab.com/jitesoft/open-source/javascript/yolog/badges/master/coverage.svg)](https://gitlab.com/jitesoft/open-source/javascript/yolog/commits/master)
[![npm](https://img.shields.io/npm/dt/@jitesoft/yolog)](https://www.npmjs.com/package/@jitesoft/yolog)
[![Back project](https://img.shields.io/badge/Open%20Collective-Tip%20the%20devs!-blue.svg)](https://opencollective.com/jitesoft-open-source)

Simple pluggable async logger for node and browser alike.  

Ever wanted a logger with a simple API that you could easily write a minimal plugin for? A logger which would work in both
your browser and in your node environment?

Well, then Yolog might be something for you.

## Installation

Simply use your favorite package manager that can pull packages from the npm repository!

```bash
npm i --save @jitesoft/yolog
yarn add @jitesoft/yolog
someothermanager --save-package-to-json-file @jitesoft/yolog
```

## Usage

Yolog have three base files which you can make use of when it is compiled:

* index.js
* node.js
* browser.js

The `index.js` is only the API (contains the `Yolog` and `Plugin` interfaces and such) and could possibly be useful
if you wish to create your own plugin but don't care about the other stuff.

The `browser.js` file contains the same code as the `index.js` and an extra `ConsolePlugin` which is pre-initialized if 
using the `default` value from the package.

The `node.js` file contains the same code as the `index.js` and an extra `ConsolePlugin` which is pre-initialized if 
using the `default` value from the package.

When including the script, there will be a global `Yolog` object containing `logger` (which is an instance of yolog
ready to use with the console plugin), `Yolog` which is the logger itself, if you wish to create a new instance yourself.
`ConsolePlugin`, which is a plugin that produces output to the console and the `Plugin` class (which is used to create new plugins)

Simply put:

```html
<script src="yolog/browser.js"></script>
<script>
    const logger = Yolog.logger;
    logger.debug('Weee!');
</script>
```

```javascript
import logger from '@jitesoft/yolog';
import logger from '@jitesoft/yolog/browser'; // Browser specific
import logger from '@jitesoft/yolog/node';    // Node specific
logger.debug('Weee!')
```

```javascript
const logger = require('@jitesoft/yolog');
const logger = require('@jitesoft/yolog/browser'); // Browser specific
const logger = require('@jitesoft/yolog/node');    // Node specific
logger.debug('Weee!')
```

### Log tags

The Yolog class have a set of pre-defined tags which are used to output different type of loggs with. It is possible to turn a 
tag on and off via code, both in a plugin or in the Yolog instance itself.  
The pre-defined tags are (name and default value):

```json
{
    "debug": true,
    "info": true,
    "warning": true,
    "error": true,
    "critical": true,
    "alert": true,
    "emergency": true
}
```

_Yolog uses the [@jitesoft/sprinf](https://www.npmjs.com/package/@jitesoft/sprintf) package to enable message and argument 
building. This due to not wanting to use a node-specific method as `util.format` when building for cross env support.
Be sure to check out supported parameter types if you wish to do some more advanced parameterization!_

Turning a tag on or off is done by calling the `set(tag, state = null)` method on either the Yolog instance (if you wish that no output
should be done for that tag at all) or by the `set(tag, state = null)` method of the plugin that you wish to specifically not get logs for
the tag from.

If no state is passed with the `set` method, it will toggle the state.

If you wish to add a new tag to yolog and a plugin, the `set` method can also be used. Just pass the tag that you wish
to create as the tag, and it will be set to the value that you pass as second argument.

You can also check the state of a given tag by using the `get(tag)` method on either the Yolog instance or the plugin.

### As event handler

The Yolog instance have a built-in event handler which can be used to listen to given tags instead of logging them
with a plugin.
  
_The events will not use the same priority queue as the normal callbacks, and will be async emitted, so do not
build your logic around that expectation.  
Each event should either return nothing or boolean value. If return value is `false` it will not bubble to the next
queued priority batch, else they will run in batches depending on priority.  
This also means that the callback could be async without the logger having any issues with it._

There are `on`, `off` and `once` methods available and they work basically as any normal event handler should.

The events emitted looks like the following:

```js
const event = {
  data: {
    message: "message" /* Message passed to the logger. */,
    arguments: [ /* argument list passed to the logger. */ ],
    timestamp: 123 /* Unix-timestamp (ms) when the logger was invoked. */, 
    tag: "tag" /* The tag that was invoked. */,
    errorObject: new Error() /* An error object created in the yolog #log method. */
  }
};

// That is...
console.log(event.data.message); // Will give you the message property.
```

_The package that Yolog uses can be found [here (@jitesoft/events)](https://www.npmjs.com/package/@jitesoft/events) if you wish to 
check out more specific details._

## Plugins

Plugins are minimal classes which can be used to extend the logger to use other type of outputs!   
When writing a new plugin, the `Plugin` class in the base lib is used as a base class (if using es6 inheritance),
the only method that really have to be implemented is the `log` method, the base class takes care of the rest!

```js
import {Plugin} from '@jitesoft/yolog';

export default class MyPlugin extends Plugin {  
  /**
   * Method called when a log message is intercepted and the plugin is listening to the given tag.
   *
   * @param {String} tag       Tag which was used when logging the message.
   * @param {Number} timestamp Timestamp (in ms) when the log was intercepted by the Yolog instance.
   * @param {String} message   Message that is passed to the plugin.
   * @param {Error} error      Error generated in the logger to be possible to use for call stack or for other reasons.
   * @return Promise<void>
   */
  async log (tag, timestamp, message, error) {
    // Do your magic here! (return a promise or use the async/await keywords!)
    return await something.something(message);
  }  
}
```

Plugin interface:

```typescript
interface PluginInterface {
  log (tag: string, timestamp: number, message: string, error): Promise<void>; /*Abstract, only method required to be implemented. */
  set (tag: string, state: boolean|null): void;
  get (tag: string): boolean|undefined;
  /*get*/ active (): Array<string>;
  /*set*/ priority (value: number): void;
  /*get*/ priority (): number;
}
```

To add a new plugin to the Yolog instance, call the `addPlugin(plugin)` method, removal can be done with `removePlugin(plugin)`.

### Notes

Any undocumented features are either in development or working as intended but not yet fully tested or documented. Use with care.

### Versioning.

Yolog follows the [Semantic Versioning 2.0.0](http://semver.org/)  
This basically means that no API breaking changes will occur without a new major version release, features might be added
during a minor release and patches are only fixes.

## Official plugins

The following list are plugins maintained and supported by Jitesoft.

* [`@jitesoft/yolog-file-plugin`](https://www.npmjs.com/package/@jitesoft/yolog-file-plugin)
* [`@jitesoft/yolog-sentry-plugin`](https://www.npmjs.com/package/@jitesoft/yolog-sentry-plugin)
* [`@jitesoft/yolog-slack-plugin`](https://www.npmjs.com/package/@jitesoft/yolog-slack-plugin)
* [`@jitesoft/yolog-email-plugin`](https://www.npmjs.com/package/@jitesoft/yolog-email-plugin)

_More are under development._

## Community developed plugins

_Create a pull request for the readme file to include your plugin here (after a general audit)!_

---

**Observe:**  
Community developed plugins listed here are not under the control of Jitesoft and any damages they may or may not cause
is nothing that Jitesoft can be held liable for. As with everything, you should always audit the code you use before
using it in production!

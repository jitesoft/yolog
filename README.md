# Yolog

[![npm (scoped)](https://img.shields.io/npm/v/@jitesoft/yolog)](https://www.npmjs.com/package/@jitesoft/yolog)
[![Known Vulnerabilities](https://dev.snyk.io/test/npm/@jitesoft/yolog/badge.svg)](https://dev.snyk.io/test/npm/@jitesoft/yolog)
[![pipeline status](https://gitlab.com/jitesoft/open-source/javascript/yolog/badges/master/pipeline.svg)](https://gitlab.com/jitesoft/open-source/javascript/yolog/commits/master)
[![coverage report](https://gitlab.com/jitesoft/open-source/javascript/yolog/badges/master/coverage.svg)](https://gitlab.com/jitesoft/open-source/javascript/yolog/commits/master)
[![npm](https://img.shields.io/npm/dt/@jitesoft/yolog)](https://www.npmjs.com/package/@jitesoft/yolog)
[![Back project](https://img.shields.io/badge/Open%20Collective-Tip%20the%20devs!-blue.svg)](https://opencollective.com/jitesoft-open-source)
[![DeepScan grade](https://deepscan.io/api/teams/5978/projects/7842/branches/85543/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=5978&pid=7842&bid=85543)

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

The `index.js` is only the API (contains the `Yolog` and `YologPlugin` interfaces and such) and could possibly be useful
if you wish to create your own plugin but don't care about the other stuff.

The `browser.js` file contains the same code as the `index.js` and an extra `ConsolePlugin` which is pre-initialized if 
using the `default` value from the package.

The `node.js` file contains the same code as the `index.js` and an extra `ConsolePlugin` which is pre-initialized if 
using the `default` value from the package.

When including the script, there will be a global `Yolog` object containing `logger` (which is an instance of yolog
ready to use with the console plugin), `Yolog` which is the logger itself, if you wish to create a new instance yourself.
`ConsolePlugin`, which is a plugin that produces output to the console and the `YologPlugin` class (which is used to create new plugins)

Simply put:

```html
<script src="yolog/browser.js"></script>
<script>
    const logger = Yolog.logger;
    logger.debug('Weee!');
</script>
```

```javascript
import { logger } from '@jitesoft/yolog';
import { logger } from '@jitesoft/yolog/browser'; // Browser specific
import { logger } from '@jitesoft/yolog/node';    // Node specific
logger.debug('Weee!')
```

```javascript
const logger = require('@jitesoft/yolog').logger;
const logger = require('@jitesoft/yolog/browser').logger; // Browser specific
const logger = require('@jitesoft/yolog/node').logger;    // Node specific
logger.debug('Weee!')
```

### Log tags

The Yolog class have a set of pre-defined tags which are used to output different type of logs with. It is possible to turn a 
tag on and off via code, both in a plugin or in the Yolog instance itself.  
The pre-defined tags are (name and default value):

```json
{
  "debug": { "enabled":  true, "error": true },
  "info": { "enabled":  true, "error": true },
  "warning": { "enabled":  true, "error": true },
  "error": { "enabled":  true, "error": true },
  "critical": { "enabled":  true, "error": true },
  "alert": { "enabled":  true, "error": true },
  "emergency": { "enabled":  true, "error": true }
}
```

When using the constructor, Yolog will accept the key-value pairs as `string : bool`, 
defaulting `error` to true and setting `enabled` to the boolean value.

The `error` key is used to allow yolog to know if it should pass a generated error object to the plugins to allow for stack traces and similar.

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
import { YologPlugin } from '@jitesoft/yolog';

export default class MyPlugin extends YologPlugin {  
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
interface YologPluginInterface {
  log (tag: string, timestamp: number, message: string, error): Promise<void>; /*Abstract, only method required to be implemented. */
  set (tag: string, state: boolean|null): void;
  get (tag: string): boolean|undefined;
  /*get*/ active (): Array<string>;
  enableError(...tag: Array<string>): this;
  disableError(...tag: Array<string>): this;
}
```

To add a new plugin to the Yolog instance, call the `addPlugin(plugin)` method, removal can be done with `removePlugin(plugin)`.

### Official plugins

The following list are plugins maintained and supported by Jitesoft.

* [`@jitesoft/yolog-file-plugin`](https://www.npmjs.com/package/@jitesoft/yolog-file-plugin)
* [`@jitesoft/yolog-sentry-plugin`](https://www.npmjs.com/package/@jitesoft/yolog-sentry-plugin)
* [`@jitesoft/yolog-slack-plugin`](https://www.npmjs.com/package/@jitesoft/yolog-slack-plugin)
* [`@jitesoft/yolog-email-plugin`](https://www.npmjs.com/package/@jitesoft/yolog-email-plugin)
* [`@jitesoft/yolog-json-plugin`](https://www.npmjs.com/package/@jitesoft/yolog-json-plugin)

_More are under development._

### Community developed plugins

_Create a pull request for the readme file to include your plugin here (after a general audit)!_

**Observe:**  
Community developed plugins listed here are not under the control of Jitesoft and any damages they may or may not cause
is nothing that Jitesoft can be held liable for. As with everything, you should always audit the code you use before
using it in production!

## More docs!

### Yolog

The Yolog base API is quite simple, there are a few methods to customize the logger, while most of the configurations should
be done in plugins.  

**Events**

As mentioned above, the Yolog instance can be used as an event handler, the methods connected to this features
are the following:

```typescript
interface Yolog {
  on(tag: string, handler: Function, priority: number): number;
  off(tag: string, handler: number | Function): boolean;
  once(tag: string, handler: Function, priority?: number): number;
}
```

The methods pretty much speak for themselves. On and Once both returns a number, the number
is the handle of the specific handler function. If the handler is to be removed, the handle 
or the function itself can be passed to yolog through the `off` method, removing it from the list of handlers.

Priority is a batch priority, that is, if multiple handlers have the same priority, they will be called
async at the same time. If either of them returns false, the event will not bubble to the next batch.  
There is currently no built in way to not allow other handlers with the same priority to stop each other.

Events start their emit before the plugins are invoked, but yolog will not wait for them to finnish before starting
to run the plugins. That way, you can not be sure that the plugins are invoked before the plugins, or the other way around.

**Plugins**

Adding and removing plugins is if possible more easy than using the events. The following methods are
used for this:

```typescript
interface Yolog {
  addPlugin(plugin: YologPlugin): Yolog;
  removePlugin(plugin: YologPlugin): Yolog;
  readonly plugins: YologPlugin[];
}
```

Plugins are all called in batch when a log command is done, they have no priority over each other and 
the promise of the log method called will resolve when all are done.

The getter `plugins` will return all the plugins that are loaded in the instance.

**Tags**

Tags is quite an important thing in yolog (and most logging...), there are a few pre-defined tags and methods
that are used to invoke those. The predefined tags are:

```javascript
const tags = [
  'debug',
  'info',
  'warning',
  'error',
  'critical',
  'alert',
  'emergency'
];
```

You may call a specific log tag via the `tagName(message: string, ...args): Promise<void>` methods, and if you wish to use
a custom tag, the `custom(tag: string, message: string, ...args): Promise<void>` method is available.  
Just make sure that the tag exists in the logger by adding it in the `set` method!

```typescript
interface Yolog {
  set(tag: string, state?: boolean): Yolog;
  get(tag: string): boolean;
}
```

The `set` method adds a tag or updates existing tags states, if it's set to `true` the tag will be available in yolog, if false, it will not
this way you can globally configure some tags to be on or off, if they are off, no event nor plugin will be invoked when the
method is used.  
`get` will return `true` or `false` depending on the state of the tag.

An example of where this can be a useful feature is when you wish to use environment specific tags:

```javascript
if (process.env.NODE_ENV === 'production') {
  yolog.set('debug', false);
  yolog.set('emergency', true);
}
```

**Active and available**

There are two getters which can be used to get information about active and available tags, they both return
lists of strings (the name of the tag) and are readonly:

```typescript
interface Yolog {
  readonly available: string[];
  readonly active: string[];
}
```

The `available` getter will return the names of all tags that are set in yolog, this includes all custom tags you have created.
The `active` getter will return the names of all the tags that have state set to `true`.

**Error**

```typescript
interface Yolog {
  enableError(...tag: Array<string>): this;
  disableError(...tag: Array<string>): this;
}
```

The enable and disable error methods toggles the Yolog instance to create and send a error to the plugins (and events). 
Each plugin have their own controll of this too, while this is on a higher level. Tags passed will be toggled on or off, while
calling the functions without any argument will set errors to on or off for all the tags instead of a single tag.

### Plugin

Just as with the base API, the plugins have their own `tags` to turn off and on! This is to make it possible to have specific 
loggin types on for some tags while others are not. For example: you might want to output `debug` to console and 
you wish to use an email plugin for the `critical` logs.  
If it was not possible to turn off most tags for the email plugin, you would receive a new email for each debug log made. 

**Active and available**

The `available` and `active` getters works as with the yolog class, the first returns all tags that are available in the plugin,
the `active` returns which are turned on.

```typescript
interface YologPlugin {
  readonly available: string[];
  readonly active: string[];
}
```

**Set and Get**

The set and get methods are - just as with the Yolog class - used to turn tags on and off and to check if a given tag is on or off.   
Calling `set` will create a new tag if none exist, else update it.  

**log**

The log method is the most important function of the Plugins. It is basically the only method that is required to be implemented to create a new plugin.
`log` is an async method which takes a tag, timestamp, message and error. The message is the formatted message that Yolog passes
to all plugins. The tag is the tag that was used when the log call was made. Timestamp is intended to be a Unix timestamp, which
can be used inside the plugin to format a nice time string for output.  

Since v 2.6.0 a new `Error` argument is passed as the last argument of the log method. It can be used to output the callstack or similar
information.

**Error**

```typescript
interface YologPlugin {
  enableError(...tag: Array<string>): this;
  disableError(...tag: Array<string>): this;
}
```

The methods allow the user to toggle each plugin errors on or off (that is, passing of the `Error` object through the log parameter at all). 
Each plugin is responsible to make sure that the error object is not `null` before doing anything with its properties.
Calling the functions without any argument will set errors to on or off for all the tags instead of a single tag.

## Notes

Any undocumented features are either in development or working as intended but not yet fully tested or documented. Use with care.

### Versioning.

Yolog follows the [Semantic Versioning 2.0.0](http://semver.org/)  
This basically means that no API breaking changes will occur without a new major version release, features might be added
during a minor release and patches are only fixes.

### Source code

The source can be found at [GitHub](https://github.com/jitesoft/yolog) and [GitLab](https://gitlab.com/jitesoft/open-source/javascript/yolog).

### Tiny bit of history, cause why not?

First release of `yolog` (back then under the name of `node-yolog`) was back in 2014, so quite a while ago... It was developed as a tiny in-house
logger - by Johannes at Talkative Labs - just to add colours to console logs. So nothing great nor special, although it did make the console look better!  
After the initial release, the work on the package went stale for quite a while, like... years!  
It was finally picked up again in 2018 and rebuilt and re-branded as `yolog` under the `@jitesoft` org. The new version was not only for colourful
console outputs, but rather a small plugin system for logging with a basic API which was easy to use and extend.  

### Development & Contributions

Contributions in any form are very welcome!   
Issues (bugs, feature requests, questions etc etc) can be posted in the [GitHub issue tracker](https://github.com/jitesoft/yolog/issues).  
Pull requests will be reviewed and should contain tests and follow the code style.

If you wish to contribute by monetary means, feel free to click the `sponsor` button on GitHub or head on over to our [OpenCollective](https://opencollective.com/jitesoft-open-source) page!

#### License

```text
The MIT License (MIT)

Copyright (c) 2019 Johannes Tegnér / Jitesoft

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

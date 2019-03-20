node-yolog
==========
[![NPM](https://nodei.co/npm/node-yolog.png?downloads=true&stars=true)](https://nodei.co/npm/node-yolog/)


Simple logger for node js that color codes and formats output.  
The main reason for the existence of the package is the ability to turn on and off log tags in runtime.  


### Installation:

`npm install node-yolog [--save]`  

### Usage.

##### Tags

Yolog has the following logging tags:
```javascript
debug (string, arguments);
info (string, arguments);
warning (string, arguments);
error (string, arguments);
todo (string arguments);
trace (arguments);
```
All (but trace) strings uses % placeholders which are replaced with the args passed, accepted placeholders are:

  * `%s` - string
  * `%d` - number
  * `%j` - json

The `trace` function takes a number of arguments and prints them in a list.
Also worth mentioning is that the trace function will print objects, but it will only go 3 levels deep.  
Max depth can be changed by calling the `setObjectMaxDepth` function with new max depth as parameter (`null` means no limit, this can crash the application if the object is circular).

##### Enable and Disable tags.
To enable or disable any tags, the `set(boolean, args);` function is used.
First arg is if the tags you want to change should be **on** or **off** (`boolean` value),
the args after first should be string representations of the tags.

*The tag names are the same as the functions.*

There is also a `get(tag)` function, which takes a tag name in as parameter and returns `boolean` value,
where `true` indicates that the tag is `on` and `false` that its `off`.

All tags are active by default.  
Disabling/Enabling a tag that do not exist will output a error message (even if errors are turned off).  

##### Change color of tags.
Not all editors and consoles outputs the colors of the tags as neatly as others, and not all find the default colors to be the preferred ones.  
So naturally, its possible to change the colors.  
The following colors are available:  

  * black
  * red
  * green
  * yellow
  * blue
  * purple
  * cyan
  * white

Setting a specific color on a tag is done by the `setColor` function.

```javascript
logger.setColor("error", "cyan");
// Which will change the color for error tagged output to cyan instead of the default red.
```

##### Function names.
As of v 0.0.7 its possible to get Yolog to print out function names in the logs.  
This should be seen as an experimental feature.  
Activating the feature (its off by default) is done by the: `logger.setShowFunctionName(true);` command.  
Generated output will look something like:  
```javascript
Debug	(14:57:01)[myFunction]: Test output!
```
In case of global or anonymous scope, the function name will be `[global/anonymous]`.

##### Timestamps
As of v 1.1.0 its possible to set a function to use for timestamps.  
Change the timestamp function by calling the `logger.setDateFunction(cb);`.  
The function takes a callback which should return a string.  
  
Example:  
```
logger.setDateFunction(function() {
  return "I do not care about the date!";
});

logger.debug('Hi!');
// Will output something like:
// Debug (I do not care about the date!): Hi!
// Preferably, a timestamp should be returned, but thats up to you!

logger.setDateFunction(function() {
  return (new Date()).getTime();
});
// Will output something like:
// Debug (1435647554656): Hi!
```


### Example usage.
```javascript
var logger = require('node-yolog');
// By default, all logging tags are set to active, IE all of them will output to console, this can be changed with the 'set' function as:
if(app.get("env") !== "development") {
  logger.set(false, "debug", "trace", "todo"); // Will disable output from debug and trace tagged output.
}
// Check if a tag is active:
if(!logger.get("debug")) {
  // But the debug tag is disabled, so we write an error instead!
  logger.info("Debug tag was not active!");
  // If the get function is called without a tag argument, it will return the whole tags object: {debug: true ... }
}
// Write debug type output:
logger.debug("some debug text. You can %s also. The placeholders are the same as the standard node util.format takes (%s, %d, %j).", "add arguments");
// The output above will not be printed in this case.

```
  
  
### Misc
The Yolog API might change in feature releases, but no functionality will be removed between two minor versions.  
Whenever a function is about to be removed, it will be tagged with the @deprecated tag.  
Keep an eye on the [releases](https://github.com/Johannestegner/node-yolog/releases) page for any changes.  
  
Any bugs, features or input can be reported to the [issue tracker](https://github.com/Johannestegner/node-yolog/issues) at github.

##### Versioning.

Yolog tries to follow [Semantic Versioning 2.0.0](http://semver.org/)  

```
Summary

Given a version number MAJOR.MINOR.PATCH, increment the:

MAJOR version when you make incompatible API changes,
MINOR version when you add functionality in a backwards-compatible manner, and
PATCH version when you make backwards-compatible bug fixes.
Additional labels for pre-release and build metadata are available as extensions to the MAJOR.MINOR.PATCH format.
```
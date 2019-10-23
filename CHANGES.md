v 2.3.0
 * Introduced a new parameter (error) for plugins.
 * Introduced new property (errorObject) on event.
 * Yolog will now generate an error object in its #log function which will be passed to plugins and events.
 * Marked #formatter method as `async` for future (possible) plans.

v 2.2.0
 * Changed from `standard` package to `@jitesoft/eslint-config`.
 * Fixed all lint errors.
 * Updated build process to not create a new package file for the project (hence including the required packages).

v 2.1.0
 * Removed the node native `util` call from mixed-platform code.
 * Added `@jitesoft/sprintf` dependency to take over for `util`.
 * Updated to latest `@jitesoft/babel-preset-main`.
 * Some minor fixes.

v 2.0.0
 * Full re-write, moved package in under the @jitesoft org.
 * New Plugin system.
 * New build setup (using babel and webpack).
 * Browser and Node version with identical API.  
   
v 1.0.0 
 
 * Refactored the code to follow a standard that fits author better.  
 * Removed the `depth` property and introduced a `setObjectMaxDepth` method to use instead.  
 * `get(tag: string)` no longer returns the full tag object when called, tag is now required.  
 * Replaced setcolor method with setColor (spelling fix).  

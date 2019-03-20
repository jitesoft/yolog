/**
 * @description A logging tool for node js.
 * @file main.js
 * @module node-yolog
 */

/**
 * @constructor
 */
function Yolog(){
  var _dateFunction = function () {
    return (new Date()).toLocaleString();
  };
  var _printFuncName = false;
  var _depth  = 3;
  var _colors = require('./colors.js');
  var _util   = require('util');
  var _eol    = process.platform === 'win32' ? '\r\n' : '\n';
  var _tags   = {
    trace:     { color: _colors.normal.cyan   ,active: true }
    , debug:   { color: _colors.normal.blue   ,active: true }
    , error:   { color: _colors.normal.red    ,active: true }
    , warning: { color: _colors.normal.yellow ,active: true }
    , info:    { color: _colors.normal.white  ,active: true }
    , todo:    { color: _colors.normal.green  ,active: true }
  };

 /**
   * Print a debug string formatted as "(date) tag: string with %s|d|j values" where % values will be replaced with passed arguments.
   * @param {string} tag Tag to use.
   * @param {string} string String to print.
   * @param {null|undefined|Array} args Arguments.
   */
  var _print = function(tag, string, args) {
   tag = tag.toLowerCase();
    if(args !== undefined && args !== null) {
      for(var i=0; i<args.length; i++){
        string = _util.format(string, args[i]);
      }
    }
    // [TagColor]Tag[/TagColor][Cyan]\tDate[/Cyan]Text\n
   var tagName = tag.charAt(0).toUpperCase() + tag.slice(1);
    var out = _util.format("%s%s%s%s\t(%s)%s: %s%s", _tags[tag].color, tagName, _colors.reset, _colors.normal.cyan, _dateFunction(), _getCaller(3),  _colors.reset, string);
    if(tag === 'error'){
      console.error(out);
    } else {
      console.log(out);
    }
  };

  /**
   * Get calling function
   * @param {int} depth Max depth to go in call-stack.
   * @returns {string} Function name.
   */
  var _getCaller = function(depth) {
    if(!_printFuncName) {
      return "";
    }
    try {
      var caller = arguments.callee.caller;
      depth = depth === undefined ? 0 : depth;
      var funcName = "global/anonymous";
      for(var i=1;i<depth;i++) {
        if(caller.caller) {
          caller = caller.caller;
        }
      }
      if(caller.name !== "") {
        funcName = caller.name;
      }
      return "[" + funcName + "]";
    }  catch(e) {
      return "[unknown/strict]";
    }
  };

  /**
   * Set depth to use when printing objects (in trace).
   * @param {number} value Maximum depth to use.
   */
  this.setObjectMaxDepth = function setObjectMaxDepth(value) {
    // this.depth should in next major version be a private variable.
    _depth = value;
  };

  /**
   * Set function to use when displaying time in logs.
   * Defaults to Date 'toLocaleString' value.
   * <example>
   * setDateFunction(function () {
   *   return (new Date()).toLocaleString();
   * });
   * </example>
   * @param {function} Function to use. 
   */    
  this.setDateFunction = function setDateFunction(func) {
    _dateFunction = func;
  };

  /**
   * If function names should be printed in the output, this should be set to true.
   * Default is true.
   * @param {boolean} state State to set it to.
   */
  this.setShowFunctionName = function setShowFunctionName(state) {
    _printFuncName = state;
  };

  /**
   * Set color of a tag.
   * @param {string} tag Tag name (debug, trace, error, info or warning).
   * @param {string} color Color as string (black, red, green, yellow, blue, purple, cyan, white).
   */
  this.setColor = function setTagColor(tag, color) {
    color = color.toLowerCase();
    tag = tag.toLowerCase();
    if(_colors.normal[color] === undefined) {
      _print("error", "Failed to set color of tag with name %s. The color (%s) is not a valid color.", [tag, color]);
    } else if(_tags[tag] === undefined) {
      _print("error", "Failed to set color of tag with name %s. The tag does not exist.", [tag]);
    }
    _tags[tag].color = _colors.normal[color];
  };

  /**
   * Set one or many tags to active or inactive.
   * @param {boolean} value True if active, false if inactive.
   * @param {...} args Argument list, one or many string of which to set to given value.
   */
  this['set'] = function setTagState(value, args) {
    for(var i=1;i<arguments.length;i++) {
      var tag = arguments[i].toLowerCase();
      if(tag in _tags) {
        _tags[tag].active = value;
      } else {
        _print("error", "Failed to set tag " + tag + " to " + (value ? "Active" : "Inactive") + ", tag do not exist.", null);
      }
    }
  };

  /**
   * Get current state of given tag.
   * @param {string} tag Tag as string.
   * @return {undefined|boolean} If tag is active, true, else false. If tag does not exist, undefined.
   */
  this['get'] = function getTagState(tag) {
    if(!tag) { return undefined; }
    tag = tag.toLowerCase();
    if(tag in _tags) {
      return _tags[tag].active;
    }
    return undefined;
  };

  /**
   * Output arguments to trace log.
   * @param {...} args Argument list.
   */
  this.trace = function trace(args) {
    if(_tags.trace.active) {
      var reg = new RegExp('\r?\n','g');
      var out = _tags.trace.color + "Trace\t(" + _dateFunction() + ")" + _getCaller(2) + ": " + _colors.reset + _tags.trace.color + " [ length: " + arguments.length + " ] " + _colors.reset + _eol;
      for (var i = 0, il = arguments.length; i < il; i++) {
        out += _tags.trace.color + "["+ i + "]\t" + _colors.reset;
        var text = _util.inspect(arguments[i], { showHidden: true, depth: _depth });
        out += text.replace(reg, _tags.trace.color + _eol + " *\t" + _colors.reset) + _colors.reset;
        out += _eol;
      }
      out += _tags.trace.color + "end trace" + _colors.reset;
      console.log(out);
    }
  };

  /**
   * Prints a debug string to stdout.
   * The string uses % placeholders and replaces them with arguments passed.
   * Possible placeholders: %s - string, %d - number, %j json.
   * @param {string} str String to print.
   * @param {...} args Argument list.
   */
  this.debug = function debug(str, args) {
    if(_tags.debug.active) {
      _print("debug", str, Array.prototype.slice.call(arguments, 1));
    }
  };

  /**
   * Prints a error string to stderr.
   * The string uses % placeholders and replaces them with arguments passed.
   * Possible placeholders: %s - string, %d - number, %j json.
   * @param {string} str String to print.
   * @param {...} args Argument list.
   */
  this.error = function error(str, args) {
    if(_tags.error.active) {
       _print("error", str, Array.prototype.slice.call(arguments, 1));
    }
  };

  /**
   * Prints a warning string to stdout.
   * The string uses % placeholders and replaces them with arguments passed.
   * Possible placeholders: %s - string, %d - number, %j json.
   * @param {string} str String to print.
   * @param {...} args Argument list.
   */
  this.warning = function warning(str, args) {
    if(_tags.warning.active) {
      _print("warning", str, Array.prototype.slice.call(arguments, 1));
    }
  };

  /**
   * Prints a info string to stdout.
   * The string uses % placeholders and replaces them with arguments passed.
   * Possible placeholders: %s - string, %d - number, %j json.
   * @param {string} str String to print.
   * @param {...} args Argument list.
   */
  this.info = function info(str, args) {
    if(_tags.info.active) {
      _print("info", str, Array.prototype.slice.call(arguments, 1));
    }
  };

  /**
   * Prints a to-do string to stdout.
   * The string uses % placeholders and replaces them with arguments passed.
   * Possible placeholders: %s - string, %d - number, %j json.
   * @param {string} str String to print.
   * @param {...} args Argument list.
   */
  this.todo = function todo(str, args) {
    if(_tags.todo.active){
      _print("todo", str, Array.prototype.slice.call(arguments,1));
    }
  };

  // region deprecated

  /**
   * If function names should be printed in the output, this should be set to true.
   * Default is true.
   * @param {boolean} state State to set it to.
   * @deprecated
   * @alias setShowFunctionName
   */
  this.showFunctionName = function showFunctionName(state) {
      this.setShowFunctionName(state);
  };

  // endregion
}

/**
 * @type {Yolog}
 */
var logger = new Yolog();
module.exports = logger;

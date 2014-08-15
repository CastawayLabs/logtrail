/*
 *
 */

var util = require('util'),
    colors = require('colors'),
    moment = require('moment');

// the idea is to create a module which can be used to hijack
// console.log(). e.g.
//
// var Logtrail = require('logtrail');
// console.log = new Logtrail({ /* options */ });

function Logtrail(config) {
  var err = new Error();

  switch (typeof config) {
    case 'undefined':
      // no confs provided; read from default confs
      break;
    case 'string':
      // confs filename provided, read from that
      break;
    case 'object':
      if (Object.prototype.toString.call(config) !== '[object Object]') {
        err.message =
          'argument <config> can be of the type <object> or <string> only!';
        err.code = 'LOGTRAIL_BADARG';
        throw err;
        //break;
      }
      // inline options provided; extend with default options
      break;
    default:
      err.message =
        'argument <config> can be of the type <object> or <string> only!';
      err.code = 'LOGTRAIL_BADARG';
      throw err;
      //break;
  }

  this._stdout = this.getConfs('stdout') || process.stdout;
  this._stderr = this.getConfs('stderr') || process.stderr;
  this._colors = this.getConfs('colors') || {
    'DEBUG': 'cyan',
    'INFO': 'green',
    'WARN': 'yellow',
    'ERROR': 'red',
    'FATAL': 'magenta'
  };
  colors.setTheme(this._colors);

}

Logtrail.prototype.readConfs = function (fname) {
  // this will mostly be used internally but we won't prefix this with _ because
  // this doesn't pass as a 'private' method at the moment
  // utilizes the node.js 'require()' method to read a json or a js that returns
  // a json containing config values and extends it with default config from the
  // config/default.json file
  // will return the complete confs object if successful and false if not
  return false;
};

Logtrail.prototype.setConfs = function (confs) {
  // confs must be of type 'object' with format:
  //   {key1: val1, key2: val2, key3: val3, ...}
  //   (nested objects are allowed) for example:
  //   {key1: {key11: val11, key12: val12, ...}, key2: val2, ...}
  // merges confs with this._confs
  // throws an error if confs is of another type
};

Logtrail.prototype.getConfs = function (keys) {
  // if keys is of type 'array' returns an object with format:
  //   {key1: val1, key2: val2, key3: val3, ...}
  // if keys is of type 'string' returns value of this._confs[keys]
  // if none of the provided keys exist in this._confs returns null
  // if keys of some other type, throws an error
  return null;
};

// logtrail.log(type, fmt[, obj1, obj2, obj3, ...])
// logtrail.log(fmt[, obj1, obj2, obj3, ...])
Logtrail.prototype.log = function (type) {
  var matter, now;
  // this part is a bit complex
  // actually it's very simple but it's a mish-mash of proto calls so it might
  // appear to be unnecessarily complex
  // --
  // so basically we have different types of logs in this._logtypes and
  // associated colors in this._colors. first we're gonna check this._logtypes
  // to see if this._logtypes contains @type. if it does, we're gonna format
  // rest of the arguments through util.format.
  // now we have something printable, but it doesn't have any colors. colors.js
  // fixes String.prototype with out this._colors such that when any of the
  // keys from this._colors is accessed from a String object, it invokes a
  // function which formats our printable with ansi colors escape-sequences.
  // we take the printable and try to access the logtype given in @type as a
  // property of our printable, which gives it a color according to @type.
  // --
  // this._logtypes and this._colors are both private properties and they are
  // kept private for a reason. if there's a need to extend logtypes, a special
  // function should be used which adds both the logtype and the corresponding
  // color to this._logtypes and this._colors respectively.
  // if for example, a logtype exists, but doesn't have a corresponding color
  // the below will almost certainly break! either both the logtype and color
  // should be available or none.
  // TODO: add such a function ^ to the Logtrail.prototype
  if (Object.keys(this._logtypes).map(function (val, idx) {
    return this._logtypes[val];
  }, this).indexOf(type) > -1) { // type is a valid logtype
    matter = ('[' + type + '] ' + util.format.apply(
      this,
      Array.prototype.slice.call(arguments, 1)
    ))[Object.keys(this._logtypes).filter(function (val, idx) {
      if (this._logtypes[val] === type) {
        return val;
      }
    }, this)];
  } else {
    matter = util.format.apply(this, arguments);
  }
  // add timestamps if they are enabled in confs
  if (this.getConfs('timestamps.enable') === true) {
    var format = this.getConfs('timestamps.format') || 'YYYY-MM-DD HH:mm:ss';
    now = moment().format(format) + ' ';
  }
  if (typeof now !== 'undefined') {
    this._stdout.write(now.grey + '\t');
  }
  // and finally write 'matter' to stdout.
  this._stdout.write(matter + '\n');
};

Logtrail.prototype._logtypes = {
  'DEBUG': 'debug',
  'INFO': 'info',
  'WARN': 'warn',
  'ERROR': 'error',
  'FATAL': 'fatal'
};

// uncomment the below and do node logtrail.js to test

// var logtrail = new Logtrail();
// logtrail.log('Hello world!');
// logtrail.log('debug', 'Hello Castaway Labs!');
// logtrail.log('info', 'This isn\'t a proper way to test.');
// logtrail.log('warn', 'We need to write mocha tests for this!');
// logtrail.log('error', 'Help! @matejkramny');
// logtrail.log('fatal', '*is many sad... wow*'.italic);

module.exports = Logtrail;

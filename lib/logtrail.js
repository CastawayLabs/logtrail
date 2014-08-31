/*
 *
 */

var fs = require('fs'),
    util = require('util'),
    colors = require('colors'),
    moment = require('moment'),
    extend = require('./extend.js'),
    callsite = require('callsite'),
    path = require('path');

function Logtrail () {
  this.configure.apply(this, arguments);

  this._stdout = process.stdout;
  this._stderr = process.stderr;

  this._logTypes = {
    'DEBUG':  'debug',
    'INFO':   'info',
    'WARN':   'warn',
    'ERROR':  'error',
    'FATAL':  'fatal'
  };

  this._logColors = {
    'DEBUG':  'cyan',
    'INFO':   'green',
    'WARN':   'yellow',
    'ERROR':  'red',
    'FATAL':  'magenta'
  };

  /*
   * Flags for util.format
   */

  this._logFlags = {
    'DEBUG':  '[DEBUG]',
    'INFO':   '[INFO]',
    'WARN':   '[WARN]',
    'ERROR':  '[ERR]',
    'FATAL':  '[FATAL]'
  };

  this._logStreams = {
    'DEBUG':  [this._stdout],
    'INFO':   [this._stdout],
    'WARN':   [this._stderr],
    'ERROR':  [this._stderr],
    'FATAL':  [this._stderr]
  };

  this.formatters = require('./formatters');

  Object.keys(this._logTypes).map(function (id) {
    var logtype = this._logTypes[id];

    /*
     * Create log function wrapper based on _logTypes
     */

    this[logtype] = function () {
      var args = Array.prototype.slice.call(arguments);
      args.unshift(logtype);

      this._logger.apply(this, args);
    };
  }, this);

  this.log = function () {
    var args = Array.prototype.slice.call(arguments);
    args.unshift('log');

    this._logger.apply(this, args);
  };
}

Logtrail.prototype.configure = function (config) {
  this._confs = require('../config/default.json');
  this._confs.basedir = path.join(__dirname, '..');

  if (!config) return;

  if (typeof config === 'string') {
    /*
     * Assume a file on the disk
     */

    config = require(config);
  }

  /*
   * Array is unacceptable
   * A terrific crime against computers
   */
  
  if (Object.prototype.toString.call(config) !== '[object Object]') {
    var err = new Error('argument <config> can be of type <object> or <string> only!');
    err.code = 'LOGTRAIL_BADARG';
    
    throw err;
  }

  /*
   * Extend the config with defaults
   */

  this._confs = extend(
    true,
    {},
    require('../config/default.json'),
    config
  );
}

Logtrail.prototype._isLogType = function (logtype) {
  return (Object.keys(this._logTypes).map(function (id) {
    return this._logTypes[id];
  }, this)).indexOf(logtype) > -1;
};

Logtrail.prototype._getLogTypeID = function (logtype) {
  var logTypeID = null;
  if (this._isLogType(logtype)) {
    logTypeID = Object.keys(this._logTypes).filter(function (id) {
      if (this._logTypes[id] === logtype) {
        return id;
      }
    }, this);
  }
  return logTypeID;
};

Logtrail.prototype._getLogColor = function (logtype) {
  var logTypeID = this._getLogTypeID(logtype);
  if (logTypeID) {
    return this._logColors[logTypeID];
  }
  return 'default';
};

Logtrail.prototype._getLogFlag = function (logtype) {
  var logTypeID = this._getLogTypeID(logtype);
  if (logTypeID) {
    return this._logFlags[logTypeID];
  }
  return '';
};

Logtrail.prototype._getLogStreams = function (logtype) {
  var logTypeID = this._getLogTypeID(logtype);
  if (logTypeID) {
    return this._logStreams[logTypeID];
  }
  return [this._stdout];
};

Logtrail.prototype._logger = function (type) {
  var self = this;
  var streams = this._getLogStreams(type);

  var stack = callsite();

  /*
   * Removes logtrail from the stack
   */
  stack.splice(0, 2);

  var entry = '';
  var args = Array.prototype.slice.call(arguments, 1);
  this.formatters.forEach(function (formatter) {
    entry = formatter.format.call(self, entry, type, args, stack);
  });

  streams.forEach(function (stream) {
    stream.write(entry);
  });
};

module.exports = Logtrail;

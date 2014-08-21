/*
 *
 */

var fs = require('fs'),
    util = require('util'),
    colors = require('colors'),
    moment = require('moment'),
    extend = require('./lib/extend.js');

function Logtrail (config) {
  var err = new Error();

  switch (typeof config) {
    case 'undefined':
      this._confs = require('./config/default.json');
      break;

    case 'string':
      this._confs = extend(
        true,
        {},
        require('./config/default.json'),
        JSON.parse(fs.readFileSync(config, 'utf-8'))
      );
      break;

    case 'object':
      if (Object.prototype.toString.call(config) !== '[object Object]') {
        err.message =
          'argument <config> can be of type <object> or <string> only!';
        err.code = 'LOGTRAIL_BADARG';
        throw err;
      }
      this._confs = extend(
        true, {}, require('./config/default.json'), config
      );
      break;

    default:
      err.message =
        'argument <config> can be of type <object> or <string> only!';
      err.code = 'LOGTRAIL_BADARG';
      throw err;
      // break;
  }

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

  this._logFlags = {
    'DEBUG':  '>',
    'INFO':   '\u2713',
    'WARN':   '!',
    'ERROR':  '?',
    'FATAL':  '\u2717'
  };

  this._logStreams = {
    'DEBUG':  [this._stdout],
    'INFO':   [this._stdout],
    'WARN':   [this._stderr],
    'ERROR':  [this._stderr],
    'FATAL':  [this._stderr]
  };

  Object.keys(this._logTypes).map(function (id) {
    var logtype = this._logTypes[id];
    this[logtype] = function () {
      args = Array.prototype.slice.call(arguments);
      args.unshift(logtype);
      this._logger.apply(this, args);
    };
  }, this);

  this.log = function () {
    this._logger.apply(this, args);
  };
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
  var matter, now = '', streams = this._getLogStreams(type);
  if (this._isLogType(type)) {
    matter = (this._getLogFlag(type).bold + ' ' +
      util.format.apply(
        this,
        Array.prototype.slice.call(arguments, 1)
      ))[this._getLogColor(type)];
  } else {
    matter = util.format.apply(this, arguments);
  }

  if (this._confs.timestamps && this._confs.timestamps.enabled) {
    now = moment().format(this._confs.timestamps.format).grey;
  }

  streams.forEach(function (stream) {
    stream.write(now + ' ' + matter + '\n');
  });
};

module.exports = Logtrail;

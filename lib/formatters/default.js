var util = require('util'),
    colors = require('colors'),
    moment = require('moment'),
    path = require('path');

exports.format = function (entry, type, args, stack) {
  var matter, now = '', stacktrace = '';

  if (this._isLogType(type)) {
    matter = this._getLogFlag(type).bold + ' ';

    matter += util.format.apply(this, args)[this._getLogColor(type)];
  } else {
    matter = util.format.apply(this, args);
  }

  if (this._confs.timestamps && this._confs.timestamps.enabled) {
    now = moment().format(this._confs.timestamps.format).grey;
  }

  if (this._confs.stacktrace) {
    stacktrace = path.relative(this._confs.basedir, stack[0].getFileName()) +
                ':' + stack[0].getLineNumber();
    stacktrace = stacktrace.grey;
  }

  return util.format('%s %s %s\n', now, stacktrace, matter);
}

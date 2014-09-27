/*
 *
 */

var stack = require('callsite'),
	path = require('path'),
	util = require('util');

function Logtrail () {
	this.levels = ['trace', 'info', 'warn', 'error', 'fatal'];

	this.config = {
		timestamp: true,
		stacktrace: true,
		loglevel: 'trace',
		basedir: path.join(__dirname, '..', '..', '..')
	};

	this.configure();
}

Logtrail.prototype.configure = function (config) {
	if (!config || typeof config !== 'object') return this.configureLogger();

	for (var c in config) {
		if (!config.hasOwnProperty(c)) continue;

		this.config[c] = config[c];
	}

	if (this.levels.indexOf(this.config.loglevel) == -1) {
		throw new Error("Loglevel '"+this.config.loglevel+"' Not Supported!");
	}

	this.configureLogger();
	return this;
};

Logtrail.prototype.configureLogger = function () {
	var suppressed = true;

	for (var i = 0; i < this.levels.length; i++) {
		if (this.levels[i] == this.config.loglevel) {
			suppressed = false;
		}

		var logger = function () {};

		if (!suppressed) {
			logger = function (l, level) {
				return function () {
					l.logger.apply(l, [level, Array.prototype.slice.call(arguments)]);
				}
			}(this, this.levels[i])
		}

		this[this.levels[i]] = logger;
		if (this.levels[i] == 'trace') {
			this.log = logger;
		}
	}
}

Logtrail.prototype.logger = function (loglevel, args) {
	var trace = [];

	if (this.config.stacktrace) {
		trace = stack();
		trace.splice(0, 2);
	}

	var line = '';
	var stream = process.stdout;
	switch (loglevel) {
		case 'trace':
		case 'info':
		case 'warn':
			line += ' ['+loglevel+'] ';
			if (trace.length > 0) {
				line += path.relative(this.config.basedir, trace[0].getFileName()) + ':' + trace[0].getLineNumber() + ' ';
			}
			line += args.join(' ');

			break;
		case 'error':
		case 'fatal':
			stream = process.stderr;
			line += ' ['+loglevel+'] ' + args.join(', ') + "\n";
			trace.forEach(function (t) {
				line += util.format('  \033[36m%s\033[0m in %s:%d\033[0m'
					, t.getFunctionName() || 'anonymous'
					, t.getFileName()
					, t.getLineNumber()) + "\n";
			});

			break;
	}

	stream.write(line+"\n");
};

module.exports = Logtrail;

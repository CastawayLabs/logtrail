/*
 *
 */

var extend = require('./extend');

function Logtrail() {
	// Configure the logtrail object within constructor
	this.configure.apply(this, arguments);
}

Logtrail.prototype.configure = function (config) {
	// Fetch default configuration
	// But only if it's not already configured
	if (! this._confs) {
		this._confs = require('../config/default.js');
	}

	// If no argument provided, set config to default
	if (! config) return;

	if (typeof config === 'string') {
		// If config is a string, assume path to config file
		try {
			config = require(config);
		} catch (error) {
			// Some error occured while reading the config file
			// Display some kind of warning that we're continuing with
			// defaults anyway
		}
	} else if (typeof config === 'object') {
		// We only want string or plain object as the config argument
		// And we're so intent on that, we'll even thrown an error!
		// Behave!
		if (Object.prototype.toString.call(config) !== '[object Object]') {
			var err = new Error(
				'argument <config> can be of type <object> or <string> only!'
			);
			err.code = 'LOGTRAIL_BADARG';
			throw err;
		}
	}

	// Extend the provided config object with the existing one
	this._confs = extend(true, {}, this._confs, config);

	// Just for kicks, return the new confs object
	return this._confs;
};

Logtrail.prototype.logger = function (type) {
	var args, logconf, stack;
	// Validate log type given in the argument
	if (Object.keys(this._confs.logs).indexOf(type) > -1) {
		// If it's a valid logtype, go ahead and fetch the relevant props
		args = Array.prototype.slice.call(arguments, 1);
		// We're extending the log-type object with default in case someone messed
		// up and forgot to define some properties of a custom log-type.
		logconf = extend(
			true,
			{},
			this._confs.logs.default,
			this._confs.logs[type]
		);

		// If the log-level is set above the level of current logtype, do nothing
		if (logconf.level < this._confs.loglevel) {
			return;
		}

		// Validate the timestamp format, fetch the timestamp and inject it into
		// the logconf object we're gonna pass the formatter
		if (typeof this._confs.timestamps === 'string') {
			// This is to make it more stupid-proof. In case someone sets the
			// timestamps object to boolean or something...
			logconf.timestamp = require('moment')().format(this._confs.timestamp);
		} else {
			logconf.timestamp = require('moment')().format('YYYY-MM-DD HH:mm:ss');
		}

		// Get the first stack with relative file
		stack = require('callsite')();
		stack.splice(0, 1); // Remove logtrail from the stack
		logconf.stack =	require('path').relative(
			this._confs.basedir, stack[0].getFileName()
		) + ':' + stack[0].getLineNumber();
	} else {
		// If the logtype is not valid, we have no way to determine whether it's
		// above or below the loglevel. That's a weakness we don't want in our
		// code.
		// This function must not be called directly by the user anyway!
		return;
	}

	// If we're still here, let's go ahead and get the formatted log-entry
	var entry = require('./format')(logconf, args);

	// Let the printing commence!
	if (Object.prototype.toString.call(logconf.target) === '[object Array]') {
		// This is when an array of different targets is provided.
		logconf.target.forEach(function (t) {
			if (typeof t === 'object' && t.writable) {
				// Plain old write-stream (e.g. process.stdout)
				t.write(entry);
			} else if (typeof t === 'function') {
				// Custom transporter (function)
				t.call(entry);
			} else if (typeof t === 'string' && t.indexOf('file:') === 0) {
				// Write to file given by 'file:path/to/file'
				// TODO:
			}
		});
	} else {
		// This means there is only one target provided
		// TODO:
	}
};

module.exports = Logtrail;

/*
 * Example!
 */

var logtrail = require('../');

logtrail.configure({
	timestamp: true,
	stacktrace: true,
	loglevel: 'trace',
	basedir: require('path').join(__dirname, '..')
});

function helloworld () {
	logtrail.log('~', 'log');
	logtrail.trace('~', 'trace');
	logtrail.info('~', 'info');
	logtrail.warn('~', 'warn');
	logtrail.error('~', 'error');
	logtrail.fatal('~', 'fatal');
}

helloworld()
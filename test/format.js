/*
 *
 */

var expect = require('chai').expect,
		format = require('../lib/format.js'),
		colors = require('colors');

// TODO this
return;

describe('format()', function() {
	var confs = require('../config/default.js');
	var pasta = [ 'Hello %s!', 'world' ];

	it('should return a string', function () {
		var result = format(confs.logs.default, pasta);
		expect(result).to.be.a('string');
	});

	it('should format the log-entry c-style', function () {
		var result = format(confs.logs.default, pasta);
		expect(result).to.equal(
			require('util').format.apply(this, pasta)
		);
	});

	it('should format the log-entry with colors', function() {
		var logconf = confs.logs.debug;
		logconf.timestamp = require('moment')()
			.format(confs.timestamp);
		logconf.stack = 'test/format.js';
		var result = format(logconf, pasta);
		expect(result).to.equal(
			logconf.format.replace(
				'%timestamp', logconf.timestamp.grey
			).replace(
				'%stack', logconf.stack.grey
			).replace(
				'%flag', logconf.flag[logconf.color]
			).replace(
				'%entry',
				require('util').format.apply(this, pasta)[logconf.color]
			)
		);
	});

	// TODO: More comprehensive tests
});

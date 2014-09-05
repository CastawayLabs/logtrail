/*
 *
 */

var util = require('util'),
		colors = require('colors'),
		moment = require('moment');

module.exports = function (logconf, pasta) {
	if (!logconf || !pasta) return;
	// TODO: Also verify the types of both
	//       logconf (plain object) &
	//       pasta (array)

	var matter = logconf.format;

	// We don't actually need the if statement, but it never hurts
	// to be extra careful. Also, required for the test to pass.
	if (typeof logconf.timestamp !== 'undefined') {
		matter = matter.replace('%timestamp', logconf.timestamp.grey);
	}

	// Same as above! Don't need it, but good to have it.
	if (typeof logconf.stack !== 'undefined') {
		matter = matter.replace('%stack', logconf.stack.grey);
	}

	// In case some idiot sets a non-string flag
	if (typeof logconf.flag !== 'string') {
		logconf.flag = '';
	}

	// In case the color is not defined
	// We probably need to make this more stupid proof, like for example
	// if someone sets a color to a color that doesn't exist in colors.js
	var flag;
	if (typeof logconf.color !== 'undefined' && logconf.color !== '') {
		flag = logconf.flag[logconf.color];
		pasta = util.format.apply(this, pasta)[logconf.color];
	} else {
		pasta = util.format.apply(this, pasta);
	}

	matter = matter.replace('%flag', flag);

	matter = matter.replace('%entry', pasta);

	return matter;
};

/*
 * lib/extend.js
 *	a node.js implementation of the jQuery.extend() method
 *	extends plain-objects with one or more other plain-objects
 *	use with caution because it overwrites the object being extended
 * -----------
 * example:
 *	var extend = require('extend');
 *	var targetObject = { key1: value1, key2: value2, key3: value3, ... },
 *			sourceObject = { key1: value4, key4: value5, ... },
 *			resultObject = extend(targetObject, sourceObject),
 *			resultObject = extend(true, targetObject, sourceObject);
 * -----------
 * if `true` is passed as the first argument, it would do a deep-copy, meaning
 *	that if the targetObject contains any objects inside it, they will also be
 *	extended - recursively!
 */
'use strict';

var extend = function () {
	var deep = false,
			target = arguments[0],
			head = 1;

	if (typeof target === 'boolean') {
		deep = target;
		target = arguments[head];
		head++;
	}

	if (Object.prototype.toString.call(target) !== '[object Object]') {
		target = {};
	}

	for (head; head < arguments.length; head++) {
		var src = arguments[head];
		if (src !== null && typeof src !== 'undefined') {
			for (var key in src) {
				if (target[key] === src[key]) {
					continue;
				}
				if (
					deep &&
					Object.prototype.toString.call(src[key]) === '[object Object]'
				) {
					target[key] = extend(true, target[key], src[key]);
				} else {
					target[key] = src[key];
				}
			}
		}
	}

	return target;
};

module.exports = extend;

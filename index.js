'use strict';
var trim = require('trim');

var monthReg = /(october|oct|november|nov|december|dec|january|jan|february|feb|march|mar|april|apr|may|june|jun|july|jul|august|aug|september|sep)/i;
var modifierReg = /(early|late|mid|end)(?:\s+)?(october|oct|november|nov|december|dec|january|jan|february|feb|march|mar|april|apr|may|june|jun|july|jul|august|aug|september|sep)/i;
var modifiers = /(early|late|mid|end)/i;
var yearlyReg = /year|year-round|year round|annual|annualy/i;

module.exports = function (input, opts) {
	if (typeof input !== 'string') {
		throw new TypeError('yearmap expects a string');
	}

	input = trim(input);

	if (input === '') {
		throw new Error('yearmap expects a non-empty string');
	}

	// use this so that each month of the year has an index: jan === 0
	var months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

	// this is the default mappings object.
	// it is used to keep track of modifiers and build the final yearmap object.
	var mappings = [
		{mon: 'jan', on: false, modifier: ''},
		{mon: 'feb', on: false, modifier: ''},
		{mon: 'mar', on: false, modifier: ''},
		{mon: 'apr', on: false, modifier: ''},
		{mon: 'may', on: false, modifier: ''},
		{mon: 'jun', on: false, modifier: ''},
		{mon: 'jul', on: false, modifier: ''},
		{mon: 'aug', on: false, modifier: ''},
		{mon: 'sep', on: false, modifier: ''},
		{mon: 'oct', on: false, modifier: ''},
		{mon: 'nov', on: false, modifier: ''},
		{mon: 'dec', on: false, modifier: ''}
	];

	opts = opts || {};
	opts.onMark = opts.onMark || 1;
	opts.offMark = opts.offMark || 0;

	var monthStrings = input.split(',');

	monthStrings.map(function (range) {
		var ranges = range.split('-');

		// get the initial values
		var reservedFrom = trim(ranges[0]).toLowerCase();
		var reservedTo = ranges.length === 2 ? trim(ranges[1]).toLowerCase() : reservedFrom;

		// strip out the modifier and month components
		function assignComponents(string) {
			var modifier = trim(string.match(modifiers)[0]);
			var month = monthify(trim(string.match(monthReg)[0]));

			// assign the modifier to its mappings object
			mappings[months.indexOf(month)].modifier = modifier;

			// return the three-letter month
			return month;
		}

		// is it year-round?
		if (yearlyReg.test(reservedFrom)) {
			reservedFrom = 'jan';
			reservedTo = 'dec';
		}

		// check for modifiers (early|late|mid|end)
		// or months-only in reservedFrom
		if (modifierReg.test(reservedFrom)) {
			reservedFrom = assignComponents(reservedFrom);
		} else if (monthReg.test(reservedFrom)) {
			reservedFrom = monthify(reservedFrom.match(monthReg)[0]);
		}

		// check for modifiers (early|late|mid|end)
		// or months-only in reservedTo
		if (modifierReg.test(reservedTo)) {
			reservedTo = assignComponents(reservedTo);
		} else if (monthReg.test(reservedTo)) {
			reservedTo = monthify(reservedTo.match(monthReg)[0]);
		}

		// now cycle through the months
		// and assign them as 'on' in the mappings object
		// Ex: (may - jul) = (4 - 6)
		var beg = months.indexOf(reservedFrom);
		var end = months.indexOf(reservedTo);

		for (var i = beg; i <= end; i++) {
			mappings[i].on = true;
		}
	});
	// build the final yearmap object
	var yearmap = [];

	mappings.map(function (month) {
		if (month.on && month.modifier !== '') {
			yearmap.push(month.modifier);
		} else if (month.on) {
			yearmap.push(opts.onMark);
		} else {
			yearmap.push(opts.offMark);
		}
	});
	return yearmap;
};

/**
 * Get three-letter month
 *
 * @param month
 * @returns {string}
 */

function monthify(month) {
	return month.substring(0, 3).toLowerCase();
}


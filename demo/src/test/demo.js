'use strict';

var Test = require('components/test/test');
var els = document.querySelectorAll('.js-dna-test');

[].slice.call(els).forEach(function (el) {
	new Test({
		el: el
	});
});

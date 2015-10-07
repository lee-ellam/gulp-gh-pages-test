'use strict';
var EventEmitter = require('eventemitter3');
var Evt = new EventEmitter();

/**
 * Class representing a dna test
 * @classdesc Constructor for a dna test
 * @param {Object} options.el. Class instance's parent element
 */
class Test {
	constructor(options = {}) {
		this.el = options.el;	
		
		// Cancel instantiation if DOM not as expected
		if (!this.verifyDOM()) {
			Evt.emit('dna.Test.didCancelInit', {
				emitter: this
			});
			return {};
		}

		this.init();

		// Everything inited as expected
		Evt.emit('dna.Test.didInit', {
			emitter: this
		});
	}
	/**
	 * Verify the required DOM nodes are present
	 * @description Check that the object instance's parent element, and any necessary child nodes, are present in the DOM
	 * @returns {Boolean} Whether all DOM nodes are present or not
	 */
	verifyDOM() {
		let hasVerified = true;
		if (!this.el) {
			hasVerified = false;
		}
		return hasVerified;
	}
	/**
	 * Initialise the class
	 * @description 
	 */
	init() {
			
	}
}

module.exports = Test;
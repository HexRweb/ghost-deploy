'use strict';

const {expect} = require('chai');

module.exports = function expectError() {
	expect(false, 'An error should have occurred').to.be.true;
};

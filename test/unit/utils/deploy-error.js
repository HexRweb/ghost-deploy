'use strict';

const {expect} = require('chai');
const DeployError = require('../../../utils/deploy-error');

describe('Unit: utils > deploy-error', function () {
	it('exports an error-like class', function () {
		const error = new DeployError('Test');
		expect(error).to.be.an.instanceof(Error);
		expect(error.message).to.equal('Test');
	});
});

'use strict';
const {expect} = require('chai');
const sinon = require('sinon').createSandbox();
const gscan = require('gscan');

const expectError = require('../../utils/expect-error');
const DeployError = require('../../../utils/deploy-error');
const validateTheme = require('../../../actions/validate-theme');

describe('Unit: actions > validate-theme', function () {
	let checkZip;
	let format;
	let results;

	beforeEach(function () {
		results = {
			error: [],
			warning: []
		};

		checkZip = sinon.stub(gscan, 'checkZip').callsFake(() => Promise.resolve({results}));
		format = sinon.stub(gscan, 'format').callsFake(a => a);
	});

	afterEach(function () {
		sinon.restore();
	});

	it('runs gscan', async function () {
		await validateTheme('/test');
		expect(checkZip.calledOnce).to.be.true;
		expect(format.calledOnce).to.be.true;
		expect(format.calledWithExactly({results})).to.be.true;
		expect(checkZip.args[0][0]).to.equal('/test');
	});

	it('passes gscan error through', async function () {
		checkZip.rejects(new Error('TESTING-theme-validation'));

		try {
			await validateTheme('/test');
			expectError();
		} catch (error) {
			expect(error.message).to.equal('TESTING-theme-validation');
		}
	});

	it('Fails with errors', async function () {
		results.error.push('test');

		try {
			await validateTheme('/test');
			expectError();
		} catch (error) {
			expect(error).to.be.instanceOf(DeployError);
			expect(error.message).to.equal('Theme validation failed');
		}
	});

	it('Fails with warnings', async function () {
		results.warning.push('test');

		try {
			await validateTheme('/test');
			expectError();
		} catch (error) {
			expect(error).to.be.instanceOf(DeployError);
			expect(error.message).to.equal('Theme validation failed');
		}
	});
});

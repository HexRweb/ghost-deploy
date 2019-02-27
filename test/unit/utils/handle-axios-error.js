'use strict';

const axios = require('axios');
const {expect} = require('chai');

const server = require('../../utils/server');
const expectError = require('../../utils/expect-error');
const handleError = require('../../../utils/handle-axios-error');
const DeployError = require('../../../utils/deploy-error');

describe('Unit: utils > handle-axios-error', function () {
	before(function (done) {
		server.listen(3000, done);
	});

	after(function done() {
		server.close();
	});

	it('unknown (non-axios) errors', async function () {
		try {
			await Promise.reject(new Error('SOMETHING_HAPPENED')).catch(handleError);
		} catch (error) {
			expect(error).to.be.instanceOf(DeployError);
			expect(error.message).to.equal('An unknown error occurred: SOMETHING_HAPPENED');
		}
	});

	it('non-ghost errors', async function () {
		try {
			await axios('http://127.0.0.1:3000/401-no-data').catch(handleError);
			expectError();
		} catch (error) {
			expect(error).to.be.instanceOf(DeployError);
			expect(error.message).to.equal('Unable to complete request: Request failed with status code 401');
		}
	});

	it('ghost errors', async function () {
		try {
			await axios('http://127.0.0.1:3000/401').catch(handleError);
			expectError();
		} catch (error) {
			expect(error).to.be.instanceOf(DeployError);
			expect(error.message).to.equal('Unable to complete request - Access denied. No client credentials');
		}
	});
	it('ghost errors', async function () {
		try {
			await axios('http://127.0.0.1:3000/403').catch(handleError);
			expectError();
		} catch (error) {
			expect(error).to.be.instanceOf(DeployError);
			expect(error.message).to.equal('Unable to complete request - Please Sign In ');
		}
	});

	it('custom message', async function () {
		const err = handleError.bind({action: 'test'});
		try {
			await axios('http://127.0.0.1:3000/401').catch(err);
			expectError();
		} catch (error) {
			expect(error).to.be.instanceOf(DeployError);
			expect(error.message).to.equal('Unable to test - Access denied. No client credentials');
		}
	});
});

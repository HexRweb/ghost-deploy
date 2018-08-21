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

	it('unknown (non-axios) errors', function () {
		return Promise.reject(new Error('SOMETHING_HAPPENED')).catch(handleError).catch(error => {
			expect(error).to.be.instanceOf(DeployError);
			expect(error.message).to.equal('An unknown error occurred: SOMETHING_HAPPENED');
		});
	});

	it('non-ghost errors', function () {
		return axios('http://127.0.0.1:3000/401-no-data').then(expectError).catch(handleError).catch(error => {
			expect(error).to.be.instanceOf(DeployError);
			expect(error.message).to.equal('Unable to complete request: Request failed with status code 401');
		});
	});

	it('ghost errors', function () {
		return axios('http://127.0.0.1:3000/401').then(expectError).catch(handleError).catch(error => {
			expect(error).to.be.instanceOf(DeployError);
			expect(error.message).to.equal('Unable to complete request - Access denied. No client credentials');
		});
	});
	it('ghost errors', function () {
		return axios('http://127.0.0.1:3000/403').then(expectError).catch(handleError).catch(error => {
			expect(error).to.be.instanceOf(DeployError);
			expect(error.message).to.equal('Unable to complete request - Please Sign In ');
		});
	});

	it('custom message', function () {
		const err = handleError.bind({action: 'test'});
		return axios('http://127.0.0.1:3000/401').then(expectError).catch(err).catch(error => {
			expect(error).to.be.instanceOf(DeployError);
			expect(error.message).to.equal('Unable to test - Access denied. No client credentials');
		});
	});
});

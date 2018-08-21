'use strict';

const {expect} = require('chai');
const sinon = require('sinon').createSandbox();
const server = require('../../utils/server');
const expectError = require('../../utils/expect-error');
const axios = require('../../../utils/axios');
const DeployError = require('../../../utils/deploy-error');

const modulePath = '../../../actions/ensure-like-ghost-instance';
const ensureLikeGhost = require(modulePath);

const url = (path = '/ghost/api/v0.1') => `http://localhost:3000${path}`;

describe('Unit: actions > ensure-like-ghost-instance', function () {
	before(function (done) {
		server.listen(3000, done);
	});

	after(function () {
		server.close();
	});

	afterEach(function () {
		sinon.restore();
	});

	it('sends HEAD request to proper url', function () {
		const head = sinon.stub(axios, 'head').rejects(new Error('testing'));

		return ensureLikeGhost(url()).then(expectError).catch(error => {
			expect(error.message).to.match(/"testing"/);
			expect(head.calledOnce).to.be.true;
			expect(head.args[0][0]).to.equal('http://localhost:3000/ghost/api/v0.1/themes');
		});
	});

	it('fails when axios succeeds', function () {
		return ensureLikeGhost(url()).catch(error => {
			expect(error).to.be.instanceOf(DeployError);
			expect(error.message).to.equal('Expected 401, got "200"');
		});
	});

	it('fails when response is not 401', function () {
		return ensureLikeGhost(url('/403')).then(expectError).catch(error => {
			expect(error).to.be.instanceOf(DeployError);
			expect(error.message).to.equal('Expected 401, got "403"');
		});
	});

	it('handles unexpected errors', function () {
		this.slow(150);
		return ensureLikeGhost('http://ghost.blog').then(expectError).catch(error => {
			expect(error).to.be.instanceOf(DeployError);
			expect(error.message).to.equal('Expected 401, got "getaddrinfo ENOTFOUND ghost.blog ghost.blog:80"');
		});
	});

	it('succeeds with 401', function () {
		return ensureLikeGhost(url('/401'));
	});
});

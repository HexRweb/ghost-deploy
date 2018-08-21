'use strict';

const {expect} = require('chai');
const sinon = require('sinon').createSandbox();

const server = require('../../utils/server');
const expectError = require('../../utils/expect-error');
const axios = require('../../../utils/axios');
const DeployError = require('../../../utils/deploy-error');
const getToken = require('../../../actions/get-token');

const opts = {
	url: 'https://ghost.blog/ghost/api/v0.1',
	username: 'ghost',
	password: 'ghost',
	id: 'client_id',
	secret: 'client_secret'
};

const expectedData = {
	username: 'ghost',
	password: 'ghost',
	/* eslint-disable camelcase */
	grant_type: 'password',
	client_id: 'client_id',
	client_secret: 'client_secret'
	/* eslint-enable camelcase */
};

describe('Unit: actions > get-token', function () {
	let post;
	let data;

	before(function (done) {
		server.listen(3000, done);
	});

	after(function () {
		server.close();
	});

	beforeEach(function () {
		data = {};
		post = sinon.stub(axios, 'post').callsFake(() => Promise.resolve({data}));
	});

	afterEach(function () {
		sinon.restore();
	});

	it('sends request to proper location', function () {
		return getToken(opts).then(() => {
			const expectedURL = 'https://ghost.blog/ghost/api/v0.1/authentication/token/';

			expect(post.calledOnce).to.be.true;
			expect(post.calledWithExactly(expectedURL, expectedData)).to.be.true;
		});
	});

	it('returns access and refresh token', function () {
		data = {
			/* eslint-disable camelcase */
			access_token: 'ACCESS',
			refresh_token: 'REFRESH'
			/* eslint-enable camelcase */
		};

		return getToken(opts).then(res => {
			expect(res.accessToken).to.equal(data.access_token);
			expect(res.refreshToken).to.equal(data.refresh_token);
		});
	});

	it('gracefully fails', function () {
		post.rejects(new Error('testing'));

		return getToken(opts).then(expectError).catch(error => {
			expect(error).to.be.instanceOf(DeployError);
			expect(error.message).to.equal('An unknown error occurred: testing');
		});
	});
});

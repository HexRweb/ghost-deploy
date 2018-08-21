'use strict';

const {expect} = require('chai');
const sinon = require('sinon').createSandbox();
const destroyTokens = require('../../../actions/destroy-tokens');

const access = 'ILikeAccess';
const refresh = 'ILikeRefresh';

const opts = {
	url: 'https://ghost.dev/',
	id: 'client_id',
	secret: 'client_secret'
};

describe('Unit: actions > destroy-tokens', function () {
	let post;
	beforeEach(function () {
		const axios = require('../../../utils/axios');
		post = sinon.stub(axios, 'post').resolves();
	});

	afterEach(function () {
		sinon.restore();
	});

	it('works with only access token', function () {
		return destroyTokens(opts, {access}).then(() => {
			expect(post.calledOnce).to.be.true;
			expect(post.args[0][1].token).to.equal(access);
		});
	});

	it('revokes access and refresh tokens in proper order', function () {
		return destroyTokens(opts, {access, refresh}).then(() => {
			expect(post.calledTwice).to.be.true;
			expect(post.args[0][1].token).to.equal(refresh);
			expect(post.args[1][1].token).to.equal(access);
		});
	});

	it('calls proper url', function () {
		return destroyTokens(opts, {access}).then(() => {
			expect(post.calledOnce).to.be.true;
			// Normally, the url has been transformed by transformOptions
			expect(post.args[0][0]).to.equal('https://ghost.dev//authentication/revoke');
		});
	});

	it('proper headers / data is sent', function () {
		return destroyTokens(opts, {access, refresh}).then(() => {
			expect(post.calledTwice).to.be.true;
			/* eslint-disable camelcase */
			expect(post.args[0][1]).to.deep.equal({
				token: refresh,
				token_type_hint: 'refresh_token',
				client_id: 'client_id',
				client_secret: 'client_secret'
			});
			expect(post.args[1][1]).to.deep.equal({
				token: access,
				token_type_hint: 'access_token',
				client_id: 'client_id',
				client_secret: 'client_secret'
			});
			/* eslint-disable camelcase */
			expect(post.args[0][2].headers.authorization).to.equal(`Bearer ${access}`);
			expect(post.args[1][2].headers.authorization).to.equal(`Bearer ${access}`);
		});
	});

	it('warns when request fails', function () {
		const warn = sinon.stub(console, 'warn');
		post.rejects(new Error('NO_INTERNET'));

		return destroyTokens(opts, {access}).then(() => {
			expect(warn.calledOnce).to.be.true;
			expect(warn.calledWithExactly('Failed to revoke refresh_token. This is a non-fatal error: NO_INTERNET'));
		});
	});
});

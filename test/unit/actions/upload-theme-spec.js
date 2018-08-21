'use strict';

const {join} = require('path');
const {expect} = require('chai');
const sinon = require('sinon').createSandbox();
const axios = require('axios');

const expectError = require('../../utils/expect-error');
const DeployError = require('../../../utils/deploy-error');
const uploadTheme = require('../../../actions/upload-theme');

const token = 'ILikeAccess';
const url = 'https://ghost.dev/';
const theme = join(__dirname, '..', '..', 'fixtures', 'valid-theme.zip');

describe('Unit: actions > upload-theme', function () {
	let create;
	let post;

	beforeEach(function () {
		post = sinon.stub(axios, 'post').resolves();
		create = sinon.stub(axios, 'create').returns({post});
	});

	afterEach(function () {
		sinon.restore();
	});

	it('proper headers / data is sent', function () {
		return uploadTheme(url, token, theme).then(() => {
			expect(create.calledOnce).to.be.true;
			expect(post.calledOnce).to.be.true;

			// Headers
			const {headers} = create.args[0][0];
			expect(headers).to.be.ok;
			expect(headers['content-type']).to.match(/multipart\/form-data; boundary=-/);
			expect(headers.authorization).to.equal(`Bearer ${token}`);

			// Data
			// This is normally transformed in transformOptions
			expect(post.args[0][0]).to.equal('https://ghost.dev//themes/upload');
			expect(post.args[0][1]._streams[0]).to.match(/valid-theme\.zip/);
		});
	});

	it('gracefully fails', function () {
		post.rejects(new Error('testing'));
		return uploadTheme(url, token, theme).then(expectError).catch(error => {
			expect(error).to.be.instanceOf(DeployError);
			expect(error.message).to.equal('An unknown error occurred: testing');
		});
	});
});

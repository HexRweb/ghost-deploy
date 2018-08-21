'use strict';

const {expect} = require('chai');
const sinon = require('sinon').createSandbox();
const expectError = require('../../utils/expect-error');
const activateTheme = require('../../../actions/activate-theme');
const DeployError = require('../../../utils/deploy-error');

const token = 'ILikeAccess';
const url = 'https://ghost.dev/';
const name = 'super-theme';

describe('Unit: actions > activate-theme', function () {
	let put;
	beforeEach(function () {
		const axios = require('../../../utils/axios');
		put = sinon.stub(axios, 'put').resolves();
	});

	afterEach(function () {
		sinon.restore();
	});

	it('calls proper url', function () {
		return activateTheme(url, token, name).then(() => {
			expect(put.calledOnce).to.be.true;
			// Normally, the url has been transformed by transformOptions
			expect(put.args[0][0]).to.equal('https://ghost.dev//themes/super-theme/activate');
		});
	});

	it('proper headers / data is sent', function () {
		return activateTheme(url, token, name).then(() => {
			expect(put.calledOnce).to.be.true;
			expect(put.args[0][1]).to.be.empty;
			expect(put.args[0][2].headers.authorization).to.equal(`Bearer ${token}`);
		});
	});

	it('warns when request fails', function () {
		put.rejects(new Error('NO_INTERNET'));

		return activateTheme(url, token, name).then(expectError).catch(error => {
			expect(put.calledOnce).to.be.true;
			expect(error).to.be.instanceOf(DeployError);
			expect(error.message).to.equal('An unknown error occurred: NO_INTERNET');
		});
	});
});

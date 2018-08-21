'use strict';

const {resolve} = require('path');
const {expect} = require('chai');
const axios = require('axios');
const deploy = require('../../deploy');

const config = {
	url: 'http://localhost:2368/ghost',
	username: 'testing@hexr.org',
	password: 'test-env!!!',
	id: 'hexr-test',
	secret: 'h3xRRx3h',
	themePath: resolve(__dirname, '..', 'fixtures', 'valid-theme.zip')
};

describe('Acceptance: Uploads a theme', function () {
	it('works', function () {
		return deploy(config).then(() => axios('http://localhost:2368/')).then(resp => {
			expect(resp.data).to.have.string('VALID_GHOST_THEME_UPLOADED');
		});
	});
});

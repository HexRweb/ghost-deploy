'use strict';

const {resolve} = require('path');
const {expect} = require('chai');
const axios = require('axios');
const deploy = require('../../deploy');

const config = {
	url: 'http://localhost:2368/ghost',
	key: '123456789876543212345678:abcdefedcbabcdefedcbabcdefedcbabcdefedcbabcdefedcbabcdefedcbabcd',
	themePath: resolve(__dirname, '..', 'fixtures', 'valid-theme.zip'),
	activateTheme: true
};

describe('Acceptance: Uploads a theme', function () {
	it('works', async function () {
		this.timeout(10000);
		await deploy(config);

		const {data} = await axios('http://localhost:2368/');
		expect(data).to.have.string('VALID_GHOST_THEME_UPLOADED');
	});
});

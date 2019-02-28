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

const sleep = () => new Promise(resolve => setTimeout(resolve, 1500));

async function waitForReady() {
	const {status} = await axios.head('http://localhost:2368/ghost/').catch(error => error);

	if (status !== 200) {
		await sleep();
		return waitForReady();
	}

	return true;
}

describe('Acceptance: Uploads a theme', function () {
	it('works', async function () {
		this.timeout(60000);

		await waitForReady();
		await deploy(config);
		await waitForReady();

		const {data} = await axios('http://localhost:2368/');
		expect(data).to.have.string('VALID_GHOST_THEME_UPLOADED');
	});
});

'use strict';
const {createReadStream} = require('fs');
const FormData = require('form-data');
const axios = require('axios');

const {AGENT} = require('../utils/axios');
const handleAxiosError = require('../utils/handle-axios-error');

module.exports = function uploadTheme(baseUrl, accessToken, themePath) {
	const handleError = handleAxiosError.bind({action: 'upload theme'});

	const url = `${baseUrl}/themes/upload`;
	const data = new FormData();
	data.append('theme', createReadStream(themePath));

	const headers = Object.assign(data.getHeaders(), {
		authorization: `Bearer ${accessToken}`,
		'user-agent': AGENT
	});

	return axios.create({headers}).post(url, data).catch(handleError);
};

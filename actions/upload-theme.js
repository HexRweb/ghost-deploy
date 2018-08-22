'use strict';
const {createReadStream} = require('fs');
const FormData = require('form-data');
const axios = require('axios');

const {AGENT} = require('../utils/axios');
const handleAxiosError = require('../utils/handle-axios-error');

/*
 * @name uploadTheme
 * @description Uploads {@link themePath} to a Ghost instance
 * @param {string} baseUrl - the API root for the Ghost instance
 * @param {string} accessToken - the authenticated access token to access {@link baseUrl}
 * @param {string} themePath - local path to the theme to upload
 * @returns {Promise} Result of the upload attempt
*/
module.exports = function uploadTheme(baseUrl, accessToken, themePath) {
	const handleError = handleAxiosError.bind({action: 'upload theme'});

	const url = `${baseUrl}/themes/upload`;
	const data = new FormData();
	data.append('theme', createReadStream(themePath));

	// Using the axios proxy utility was causing too many issues 😭
	const headers = Object.assign(data.getHeaders(), {
		authorization: `Bearer ${accessToken}`,
		'user-agent': AGENT
	});

	return axios.create({headers}).post(url, data).catch(handleError);
};

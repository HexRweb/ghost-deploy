'use strict';
const axios = require('../utils/axios');
const handleAxiosError = require('../utils/handle-axios-error');

/*
 * @name activateTheme
 * @description Activates a remote Ghost theme
 * @param {string} baseUrl - the API root URL
 * @param {string} accessToken - the access token to access {baseUrl}
 * @param {string} themeName - the name of the theme (remote) to activate
 * @returns {Promise} Result of activation request
*/
module.exports = function activateTheme(baseUrl, accessToken, themeName) {
	const handleError = handleAxiosError.bind({action: 'activate theme'});

	const url = `${baseUrl}/themes/${themeName}/activate`;

	return axios.put(url, {}, {
		headers: {
			authorization: `Bearer ${accessToken}`
		}
	}).catch(handleError);
};

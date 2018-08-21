'use strict';
const axios = require('../utils/axios');
const handleAxiosError = require('../utils/handle-axios-error');

module.exports = function uploadTheme(baseUrl, accessToken, themeName) {
	const handleError = handleAxiosError.bind({action: 'activate theme'});

	const url = `${baseUrl}/themes/${themeName}/activate`;

	return axios.put(url, {}, {
		headers: {
			authorization: `Bearer ${accessToken}`
		}
	}).catch(handleError);
};

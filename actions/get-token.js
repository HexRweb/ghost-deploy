'use strict';
const axios = require('../utils/axios');
const handleAxiosError = require('../utils/handle-axios-error');

/*
 * @name getToken
 * @description authenticates with Ghost and retrieves access and refresh tokens
 * @param {object} instance - instance details (API root, Client ID, Client Secret, username, and
 * password) to authenticate
 * @param {string} accessToken - the authenticated token used to revoke {@link token}
 * @returns {Promise} Result of revocation request. Resolves {accessToken, refreshToken}
*/
module.exports = function getToken(options) {
	const {username, password, id, secret} = options;
	const url = `${options.url}/authentication/token/`;
	const handleError = handleAxiosError.bind({action: 'retrieve token'});

	const formData = {
		username,
		password,
		/* eslint-disable camelcase */
		grant_type: 'password',
		client_id: id,
		client_secret: secret
		/* eslint-enable camelcase */
	};

	return axios.post(url, formData).then(({data}) => {
		return {
			accessToken: data.access_token,
			refreshToken: data.refresh_token
		};
	}).catch(handleError);
};

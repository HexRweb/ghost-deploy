'use strict';
const axios = require('../utils/axios');
const handleAxiosError = require('../utils/handle-axios-error');

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

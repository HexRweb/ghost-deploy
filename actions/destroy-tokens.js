'use strict';

const axios = require('../utils/axios');

function destroyToken(options, authToken, token, type = 'access_token') {
	const formData = {
		token,
		/* eslint-disable camelcase */
		token_type_hint: type,
		client_id: options.id,
		client_secret: options.secret
		/* eslint-enable camelcase */
	};

	return axios.post(`${options.url}/authentication/revoke`, formData, {
		headers: {
			authorization: `Bearer ${authToken}`
		}
	}).catch(err => {
		console.warn(`Failed to revoke ${type}. This is a non-fatal error: ${err}`);
	});
}

module.exports = function destroyTokens(options, tokens) {
	let promise = Promise.resolve();
	if (tokens.refresh) {
		promise = destroyToken(options, tokens.access, tokens.refresh, 'refresh_token');
	}

	return promise.then(() => destroyToken(options, tokens.access, tokens.access));
};

'use strict';

const axios = require('../utils/axios');
const {warn} = require('../utils/log');

/*
 * @name destroyToken
 * @description destroys a single Ghost token
 * @param {object} instance - instance details (base URL, Client ID and Client Secret) to
 * destroy the token
 * @param {string} accessToken - the authenticated token used to revoke {@link token}
 * @param {string} token - the token to delete. Can be the same as {@link accessToken}
 * @param {string} type - the type of token (`access_token` or `refresh_token`)
 * @returns {Promise} Result of revocation request (will always resolve)
*/
function destroyToken(instance, accessToken, token, type = 'access_token') {
	const formData = {
		token,
		/* eslint-disable camelcase */
		token_type_hint: type,
		client_id: instance.id,
		client_secret: instance.secret
		/* eslint-enable camelcase */
	};

	return axios.post(`${instance.url}/authentication/revoke`, formData, {
		headers: {
			authorization: `Bearer ${accessToken}`
		}
	}).catch(err => {
		warn(`Failed to revoke ${type}. This is a non-fatal error: ${err}`);
	});
}
/*
 * @name destroyToken
 * @description destroys the access and refresh tokens for a given Ghost instance
 * @param {object} instance - instance details (base URL, Client ID and Client Secret) to
 * destroy the token
 * @param {object} tokens - the `access` and `refresh` token. Access token is required, refresh isn't
 * @returns {Promise} Result of revocation requests (will always resolve)
*/
module.exports = function destroyTokens(options, tokens) {
	let promise = Promise.resolve();
	if (tokens.refresh) {
		promise = destroyToken(options, tokens.access, tokens.refresh, 'refresh_token');
	}

	return promise.then(() => destroyToken(options, tokens.access, tokens.access));
};

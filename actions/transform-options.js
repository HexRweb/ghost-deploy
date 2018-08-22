'use strict';
const {parse, format} = require('url');
const DeployError = require('../utils/deploy-error');

/*
 * @name transformOptions
 * @description ensures required options exist and transforms URL to a Ghost API root
 * @param {object} options - options to validate
 * @returns {Promise} the transformed options
*/
module.exports = function transformOptions(options) {
	const {username, password, id, secret, token, themePath} = options;
	let {url} = options;

	let hasCredentials = true;

	[username, password, id, secret].forEach(cred => {
		hasCredentials &= Boolean(cred);
	});

	if (!hasCredentials && !token) {
		return Promise.reject(new DeployError('Necessary credentials not supplied'));
	}

	if (!url) {
		return Promise.reject(new DeployError('Url not supplied'));
	}

	url = parse(url);
	url.hash = '';
	url.search = '';
	url.pathname = url.pathname.replace(/\/ghost.*$/, ''); // Remove /ghost...
	url.pathname = url.pathname.replace(/\/$/, ''); // No trailing slash
	url.pathname = `${url.pathname}/ghost/api/v0.1`; // Add API root
	url = format(url);

	if (!themePath) {
		return Promise.reject(new DeployError('Theme path must be supplied'));
	}

	return Promise.resolve(Object.assign({}, options, {url}));
};

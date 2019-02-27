const {parse, format} = require('url');
const DeployError = require('../utils/deploy-error');

/*
 * @name transformOptions
 * @description ensures required options exist and transforms URL to a Ghost API root
 * @param {object} options - options to validate
 * @returns {Promise} the transformed options
*/
module.exports = function transformOptions(options) {
	const {key, themePath} = options;
	let {url} = options;

	if (!key) {
		throw new DeployError('Admin API Key must be supplied');
	}

	if (!url) {
		throw new DeployError('Url not supplied');
	}

	url = parse(url);
	url.hash = '';
	url.search = '';
	url.pathname = url.pathname.replace(/\/ghost.*$/, ''); // Remove /ghost*
	url.pathname = url.pathname.replace(/\/$/, ''); // No trailing slash
	url = format(url);

	if (!themePath) {
		throw new DeployError('Theme path must be supplied');
	}

	return Object.assign(options, {url});
};

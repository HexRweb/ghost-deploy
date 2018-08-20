'use strict';

const DeployError = require('../utils/deploy-error');
const axios = require('../utils/axios');

const reject = (...args) => Promise.reject(...args); // eslint-disable-line prefer-promise-reject-errors

module.exports = function ensureLikeGhostInstance(url) {
	// Reject on success because we expect a 401 (unauthorized) error
	return axios.head(`${url}/themes`).then(reject).catch(error => {
		const code = error.response ? error.response.status : error.status;

		if (code !== 401) {
			return Promise.reject(new DeployError(`Expected 401, got "${code || error.message}"`));
		}
	});
};

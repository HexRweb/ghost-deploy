'use strict';
const DeployError = require('./deploy-error');

module.exports = function handleAxiosError(error) {
	if (!error.response || (error.response && !error.response.data)) {
		return Promise.reject(new DeployError(`An unknown error occurred: ${error.message}`));
	}

	const {data} = error.response;
	const action = this && this.action ? this.action : 'complete request';

	if (data.errors && data.errors.length > 0) {
		const {message, context = ''} = data.errors[0];
		return Promise.reject(new DeployError(`Unable to ${action} - ${message} ${context}`));
	}

	return Promise.reject(new DeployError(`Unable to ${action}: ${error.message}`));
};

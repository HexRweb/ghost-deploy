'use strict';
const DeployError = require('./deploy-error');

/*
 * This function is an error handler for issues with HTTP requests. It parses the error object
 * to determine the type of error and rejects with a DeployError. The error message is determined
 * by the parsing results
*/
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

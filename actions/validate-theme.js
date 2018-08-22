'use strict';

const gscan = require('gscan');
const DeployError = require('../utils/deploy-error');

/*
 * @name validateTheme
 * @description Validates theme located at {@link path}
 * @param {string} path - path to the theme to validate
 * @returns {Promise} Result of the validation. Can reject using a normal Error object
*/
module.exports = function validateTheme(path) {
	return gscan.checkZip(path).then(report => {
		const {results} = gscan.format(report);
		if (results.error.length > 0 || results.warning.length > 0) {
			return Promise.reject(new DeployError('Theme validation failed'));
		}
	});
};

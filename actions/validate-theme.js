'use strict';

const gscan = require('gscan');
const DeployError = require('../utils/deploy-error');

module.exports = function validateTheme(path) {
	return gscan.checkZip(path).then(report => {
		const {results} = gscan.format(report);
		if (results.error.length > 0 || results.warning.length > 0) {
			return Promise.reject(new DeployError('Theme validation failed'));
		}
	});
};

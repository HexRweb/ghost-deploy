const gscan = require('gscan');
const DeployError = require('../utils/deploy-error');

/*
 * @name validateTheme
 * @description Validates theme located at {@link path}
 * @param {string} path - path to the theme to validate
 * @returns {Promise} Result of the validation. Can reject using a normal Error object
*/
module.exports = async function validateTheme(path) {
	const {results} = gscan.format(await gscan.checkZip(path));

	if (results.error.length > 0 || results.warning.length > 0) {
		throw new DeployError('Theme validation failed');
	}
};

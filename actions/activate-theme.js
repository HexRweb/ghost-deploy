// @const handleAxiosError = require('../utils/handle-axios-error');
const DeployError = require('../utils/deploy-error');

/*
 * @name activateTheme
 * @description Activates a remote Ghost theme
 * @param {GhostAdminAPI} api - instance of API
 * @param {string} themeName - the name of the theme (remote) to activate
 * @returns {Promise} Result of activation request
*/
module.exports = function activateTheme(_, __) { // eslint-disable-line no-unused-vars
	throw new DeployError('Activating Ghost Themes is not currently supported');
};

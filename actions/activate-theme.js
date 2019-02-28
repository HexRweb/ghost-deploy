/*
 * @name activateTheme
 * @description Activates a remote Ghost theme
 * @param {GhostAdminAPI} api - instance of API (when fully implemented @todo remove)
 * @param {string} themeName - the name of the theme (remote) to activate
 * @returns {Promise} Result of activation request
*/
module.exports = async function activateTheme({key, url}, themeName) {
	/* @note: The reason activating themes is only allowed in CI is because Ghost 2.16.x doesn't support PUT methods to the theme endpoint. This is because the API is still being finalized. In CI, we need to activate the theme to make sure the theme actually uploaded, so this is here for the next few months while the Ghost team finalizes the implementation of this part of the API. Even this method of using the API is extremely hacky */
	if (process.env.CI) {
		const token = require('@tryghost/admin-api/lib/token');
		const axios = require('axios');

		url = `${url}/ghost/api/v2/admin/themes/${themeName}/activate`;
		return axios({
			url,
			method: 'PUT',
			headers: {
				Authorization: `Ghost ${token('v2', key)}`
			}
		});
	}

	throw new DeployError('Activating Ghost Themes is not currently supported by the Ghost API')
};

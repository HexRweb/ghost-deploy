const GhostAdminAPI = require('@tryghost/admin-api');

const {log} = require('./utils/log');
const normalizeOptions = require('./actions/normalize-options');
const validateTheme = require('./actions/validate-theme');
const activateTheme = require('./actions/activate-theme');

module.exports = async function deployGhostTheme(options) {
	normalizeOptions(options);
	const api = new GhostAdminAPI({
		url: options.url,
		version: 'v2',
		key: options.key
	});

	if (!options.skipThemeValidation) {
		log('Checking theme validity');
		await validateTheme(options.themePath);
	}

	log('Uploading theme');
	const {data: uploadResult} = await api.themes.upload({file: options.themePath});

	// Active the theme if wanted and not currently active
	if (options.activateTheme && !uploadResult.themes[0].active) {
		log('Activating theme');
		await activateTheme(api, uploadResult.themes[0].name);
	}
};

module.exports.DeployError = require('./utils/deploy-error');
module.exports.log = require('./utils/log');

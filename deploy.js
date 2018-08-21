const transformOptions = require('./actions/transform-options');
const ensureLikeGhostInstance = require('./actions/ensure-like-ghost-instance');
const validateTheme = require('./actions/validate-theme');
const getToken = require('./actions/get-token');
const uploadTheme = require('./actions/upload-theme');
const activateTheme = require('./actions/activate-theme');
const destroyTokens = require('./actions/destroy-tokens');

module.exports = function deployGhostTheme(options) {
	const tokens = {};
	let opts;

	/* Named ensureLikeGhostInstance because we're not doing a full on
	 * check, just making sure the API responds how we expect it to
	*/
	return transformOptions(options).then(options => {
		opts = options;
		console.log('Checking URL validity');
		return ensureLikeGhostInstance(opts.url);
	}).then(function actionValidate() {
		if (opts.skipThemeValidation) {
			return Promise.resolve();
		}

		console.log('Checking theme validity');
		return validateTheme(opts.themePath);
	}).then(function actionGet() {
		if (opts.token) {
			return Promise.resolve({accessToken: opts.token});
		}

		console.log('Retrieving access token');
		return getToken(opts);
	}).then(function actionUpload({accessToken, refreshToken}) {
		tokens.access = accessToken;
		tokens.refresh = refreshToken;

		console.log('Uploading theme');
		return uploadTheme(opts.url, accessToken, opts.themePath);
	}).then(function actionActivate({data}) {
		// Don't active the theme if we don't want to or it's already active
		if (!opts.activateTheme || data.themes[0].active) {
			return Promise.resolve();
		}

		console.log('Activating theme');
		return activateTheme(opts.url, tokens.access, data.themes[0].name);
	}).then(function actionDestroy() {
		if (opts.token || !(tokens.access || tokens.refresh)) {
			return Promise.resolve();
		}

		console.log('Destroying access tokens');
		return destroyTokens(opts, tokens);
	});
};

module.exports.DeployError = require('./utils/deploy-error');

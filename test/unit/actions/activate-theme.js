const {expect} = require('chai');
// @const sinon = require('sinon').createSandbox();
const expectError = require('../../utils/expect-error');
const activateTheme = require('../../../actions/activate-theme');
const DeployError = require('../../../utils/deploy-error');

/*
@const url = 'https://ghost.dev/';
const name = 'super-theme';
*/
describe('Unit: actions > activate-theme', function () {
	it('Throws an error for now', function () {
		const {CI} = process.env;
		process.env.CI = false;
		try {
			activateTheme('Testing', 'yest');
			expectError();
		} catch (error) {
			expect(error).to.be.instanceOf(DeployError);
			expect(error.message).to.equal('Activating Ghost Themes is not currently supported');
		} finally {
			process.env.CI = CI;
		}
	});
});

const {expect} = require('chai');
const sinon = require('sinon').createSandbox();
const rewire = require('rewire');

const deploy = rewire('../../deploy');
const {mute} = require('../../utils/log');

const themeData = {themes: [{active: false, name: 'theme'}]};
let themeUploadStub;

class GhostAdminAPI {
	constructor() {
		this.themes = {
			upload: themeUploadStub
		};
	}
}

describe('Unit: deploy', function () {
	let transform;
	let validate;
	let activate;

	beforeEach(function () {
		// eslint-disable-next-line no-return-assign
		transform = sinon.stub().callsFake(opts => opts.themePath = '/dev/null');
		validate = sinon.stub().resolves();
		activate = sinon.stub().resolves();
		mute();

		deploy.__set__('normalizeOptions', transform);
		deploy.__set__('validateTheme', validate);
		deploy.__set__('activateTheme', activate);
		deploy.__set__('GhostAdminAPI', GhostAdminAPI);

		themeUploadStub = sinon.stub().resolves({data: themeData});
	});

	afterEach(function () {
		sinon.restore();
	});

	it('runs in the correct order', async function () {
		await deploy({});
		expect(transform.calledOnce).to.be.true;
		expect(validate.calledAfter(transform)).to.be.true;
		expect(themeUploadStub.calledAfter(validate)).to.be.true;
		expect(activate.called).to.be.false;
	});

	it('skips theme validation based on options', async function () {
		await deploy({skipThemeValidation: true});
		expect(validate.called).to.be.false;
		expect(transform.calledOnce).to.be.true;
		expect(themeUploadStub.calledOnce).to.be.true;
		expect(activate.calledOnce).to.be.false;
	});

	describe('activate', function () {
		it('called when settings are enabled', async function () {
			await deploy({activateTheme: true});
			expect(transform.calledOnce).to.be.true;
			expect(validate.calledOnce).to.be.true;
			expect(themeUploadStub.calledOnce).to.be.true;
			expect(activate.called).to.be.true;
		});

		it('skips when theme is already active', async function () {
			themeData.themes[0].active = true;

			await deploy({activateTheme: true}).catch(error => {
				themeData.themes[0].active = false;
				throw error;
			});

			themeData.themes[0].active = false;
			expect(transform.calledOnce).to.be.true;
			expect(validate.calledOnce).to.be.true;
			expect(themeUploadStub.calledOnce).to.be.true;
			expect(activate.called).to.be.false;
		});

		it('skips when settings are disabled', async function () {
			await deploy({activateTheme: false});
			expect(transform.calledOnce).to.be.true;
			expect(validate.calledOnce).to.be.true;
			expect(themeUploadStub.calledOnce).to.be.true;
			expect(activate.called).to.be.false;
		});
	});
});

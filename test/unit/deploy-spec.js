'use strict';

const {expect} = require('chai');
const sinon = require('sinon').createSandbox();
const rewire = require('rewire');

const deploy = rewire('../../deploy');

describe('Unit: Deploy', function () {
	let transform;
	let ghosty;
	let validate;
	let retrieve;
	let upload;
	let destroy;

	beforeEach(function () {
		transform = sinon.stub().resolves({});
		ghosty = sinon.stub().resolves();
		validate = sinon.stub().resolves();
		retrieve = sinon.stub().resolves({accessToken: true});
		upload = sinon.stub().resolves();
		destroy = sinon.stub().resolves();
		sinon.stub(console, 'log');

		deploy.__set__('transformOptions', transform);
		deploy.__set__('ensureLikeGhostInstance', ghosty);
		deploy.__set__('validateTheme', validate);
		deploy.__set__('getToken', retrieve);
		deploy.__set__('uploadTheme', upload);
		deploy.__set__('destroyTokens', destroy);
	});

	afterEach(function () {
		sinon.restore();
	});

	it('runs in the correct order', function () {
		return deploy().then(() => {
			expect(transform.calledOnce).to.be.true;
			expect(ghosty.calledAfter(transform)).to.be.true;
			expect(validate.calledAfter(ghosty)).to.be.true;
			expect(retrieve.calledAfter(validate)).to.be.true;
			expect(upload.calledAfter(retrieve)).to.be.true;
			expect(destroy.calledAfter(upload)).to.be.true;
		});
	});

	it('skips theme validation based on options', function () {
		transform.resolves({skipThemeValidation: true});

		return deploy().then(() => {
			expect(validate.called).to.be.false;
			expect(transform.calledOnce).to.be.true;
			expect(ghosty.calledOnce).to.be.true;
			expect(retrieve.calledOnce).to.be.true;
			expect(upload.calledOnce).to.be.true;
			expect(destroy.calledOnce).to.be.true;
		});
	});

	it('skips token validation and destruction if token is provided', function () {
		transform.resolves({token: true});

		return deploy().then(() => {
			expect(retrieve.called).to.be.false;
			expect(destroy.called).to.be.false;
			expect(transform.calledOnce).to.be.true;
			expect(ghosty.calledOnce).to.be.true;
			expect(validate.calledOnce).to.be.true;
			expect(upload.calledOnce).to.be.true;
		});
	});
	it('skips token destruction if tokens do not exist', function () {
		retrieve.resolves({});

		return deploy().then(() => {
			expect(destroy.called).to.be.false;
			expect(transform.calledOnce).to.be.true;
			expect(ghosty.calledOnce).to.be.true;
			expect(retrieve.calledOnce).to.be.true;
			expect(validate.calledOnce).to.be.true;
			expect(upload.calledOnce).to.be.true;
		});
	});
});

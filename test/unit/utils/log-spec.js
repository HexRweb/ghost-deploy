'use strict';

const {expect} = require('chai');
const sinon = require('sinon').createSandbox();
const rewire = require('rewire');

const log = rewire('../../../utils/log');

describe('Unit: utils > log', function () {
	let logStub;
	let warnStub;

	beforeEach(function () {
		logStub = sinon.stub();
		warnStub = sinon.stub();

		log.__set__('shouldLog', true);
		log.__set__('console', {
			log: logStub,
			warn: warnStub
		});
	});

	afterEach(function () {
		sinon.restore();
	});

	it('log calls console.log', function () {
		log.log('hello', {}, '!');
		expect(logStub.calledOnce).to.be.true;
		expect(logStub.calledWithExactly('hello', {}, '!')).to.be.true;
		expect(warnStub.called).to.be.false;
	});

	it('warn calls console.warn', function () {
		log.warn('hello', {}, '!');
		expect(warnStub.calledOnce).to.be.true;
		expect(warnStub.calledWithExactly('hello', {}, '!')).to.be.true;
		expect(logStub.called).to.be.false;
	});

	it('mute silences output', function () {
		log.mute();
		expect(log.log('test')).to.be.false;
		expect(logStub.called).to.be.false;
		expect(warnStub.called).to.be.false;
	});

	it('unmute re-activates output', function () {
		log.__set__('shouldLog', false);
		log.unmute();

		log.log('log');
		log.warn('warn');

		expect(logStub.calledOnce).to.be.true;
		expect(warnStub.calledOnce).to.be.true;
		expect(logStub.calledWithExactly('log')).to.be.true;
		expect(warnStub.calledWithExactly('warn')).to.be.true;
	});
});

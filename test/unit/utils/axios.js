'use strict';

const {expect} = require('chai');
const axios = require('../../../utils/axios');
const pkg = require('../../../package.json');

const UA = `${pkg.name}/${pkg.version} (${pkg.repository})`;

describe('Unit: utils > axios (wrapper)', function () {
	it('exports proper UA', function () {
		expect(axios.AGENT).to.equal(UA);
	});

	it('exports axios-like instance', function () {
		expect(axios.defaults.headers['user-agent']).to.equal(UA);
		expect(axios.get).to.be.a('function');
		expect(axios.post).to.be.a('function');
	});
});

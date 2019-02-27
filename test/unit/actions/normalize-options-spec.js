'use strict';
const {expect} = require('chai');

const expectError = require('../../utils/expect-error');
const DeployError = require('../../../utils/deploy-error');
const validateOptions = require('../../../actions/normalize-options');

const defaults = () => ({
	key: 'aaaaaaaaaaaaaaaaaaaaaaaa:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
	url: 'https://ghost.blog',
	themePath: '/dev/null'
});

describe('Unit: actions > normalize-options', function () {
	it('fails without API Key', function () {
		try {
			const options = defaults();
			delete options.key;

			validateOptions(options);
			expectError();
		} catch (error) {
			expect(error).to.be.instanceOf(DeployError);
			expect(error.message).to.equal('Admin API Key must be supplied');
		}
	});

	it('fails without url', function () {
		try {
			const options = defaults();
			delete options.url;

			validateOptions(options);
			expectError();
		} catch (error) {
			expect(error).to.be.instanceOf(DeployError);
			expect(error.message).to.equal('Url not supplied');
		}
	});

	describe('url transformations', function () {
		let opts;

		beforeEach(function () {
			opts = defaults();
			delete opts.url;
		});

		it('https://my.blog/', function () {
			opts.url = 'https://my.blog/';

			validateOptions(opts);
			expect(opts.url).to.equal('https://my.blog');
		});

		it('https://my.blog/ghost/', function () {
			opts.url = 'https://my.blog/ghost/';
			validateOptions(opts);
			expect(opts.url).to.equal('https://my.blog');
		});

		it('https://my.blog/ghost/api', function () {
			opts.url = 'https://my.blog/ghost/api/';
			validateOptions(opts);
			expect(opts.url).to.equal('https://my.blog');
		});

		it('https://my.blog/ghost/', function () {
			opts.url = 'https://my.blog/ghost/';
			validateOptions(opts);
			expect(opts.url).to.equal('https://my.blog');
		});

		it('https://ghost.mysite.me', function () {
			opts.url = 'https://ghost.mysite.me';
			validateOptions(opts);
			expect(opts.url).to.equal('https://ghost.mysite.me');
		});

		it('https://ghost.mysite.me/ghost/#/settings', function () {
			opts.url = 'https://ghost.mysite.me/ghost/#/settings';
			validateOptions(opts);
			expect(opts.url).to.equal('https://ghost.mysite.me');
		});

		it('https://ghost.mysite.me/ghost/posts?limit=all#tests', function () {
			opts.url = 'https://ghost.mysite.me/ghost/posts?limit=all#test';
			validateOptions(opts);
			expect(opts.url).to.equal('https://ghost.mysite.me');
		});
	});

	it('requires themePath', function () {
		try {
			const options = defaults();
			delete options.themePath;

			validateOptions(options);
			expectError();
		} catch (error) {
			expect(error).to.be.instanceOf(DeployError);
			expect(error.message).to.equal('Theme path must be supplied');
		}
	});
});

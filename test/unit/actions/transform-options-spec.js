'use strict';
const {expect} = require('chai');

const expectError = require('../../utils/expect-error');
const DeployError = require('../../../utils/deploy-error');
const transformOptions = require('../../../actions/transform-options');

describe('Unit: actions > transform-options', function () {
	describe('credentials', function () {
		function fail(result) {
			expect(result).to.be.instanceOf(DeployError);
			expect(result.message).to.equal('Necessary credentials not supplied');
		}

		function pass(result) {
			expect(result).to.be.instanceOf(DeployError);
			expect(result.message).to.equal('Url not supplied');
		}

		it('fail: no properties or token', function () {
			return transformOptions({}).then(expectError).catch(fail);
		});
		it('pass: one property + token', function () {
			return transformOptions({username: 'test', token: 'token'})
				.then(expectError)
				.catch(pass);
		});
		it('pass: two properties + token', function () {
			return transformOptions({username: 'test', password: 'test', token: 'token'})
				.then(expectError)
				.catch(pass);
		});
		it('fail: one property + no token', function () {
			return transformOptions({password: 'test'}).then(expectError).catch(fail);
		});

		it('fail: two properties + no token', function () {
			return transformOptions({username: 'test', password: 'test'})
				.then(expectError)
				.catch(fail);
		});

		it('pass: all properties + no token', function () {
			return transformOptions({username: 'test', password: 'test', id: 'id', secret: 'sec'})
				.then(expectError)
				.catch(pass);
		});

		it('pass: all properties + token', function () {
			return transformOptions({username: 'test', password: 'test', id: 'id', secret: 'sec', token: 'token'})
				.then(expectError)
				.catch(pass);
		});
	});

	it('fails without url', function () {
		return transformOptions({token: 'token'}).then(expectError).catch(error => {
			expect(error).to.be.instanceOf(DeployError);
			expect(error.message).to.equal('Url not supplied');
		});
	});

	describe('url transformations', function () {
		let opts;

		beforeEach(function () {
			opts = {
				token: 'token',
				themePath: 'true'
			};
		});
		it('https://my.blog/', function () {
			opts.url = 'https://my.blog/';
			return transformOptions(opts).then(res => {
				expect(res.url).to.equal('https://my.blog/ghost/api/v0.1');
			});
		});

		it('https://my.blog/ghost/', function () {
			opts.url = 'https://my.blog/ghost/';
			return transformOptions(opts).then(res => {
				expect(res.url).to.equal('https://my.blog/ghost/api/v0.1');
			});
		});

		it('https://my.blog/ghost/api', function () {
			opts.url = 'https://my.blog/ghost/api/';
			return transformOptions(opts).then(res => {
				expect(res.url).to.equal('https://my.blog/ghost/api/v0.1');
			});
		});

		it('https://my.blog/ghost/api/v0.1/', function () {
			opts.url = 'https://my.blog/ghost/api/v0.1/';
			return transformOptions(opts).then(res => {
				expect(res.url).to.equal('https://my.blog/ghost/api/v0.1');
			});
		});

		it('https://ghost.mysite.me', function () {
			opts.url = 'https://ghost.mysite.me';
			return transformOptions(opts).then(res => {
				expect(res.url).to.equal('https://ghost.mysite.me/ghost/api/v0.1');
			});
		});

		it('https://ghost.mysite.me/ghost/#/settings', function () {
			opts.url = 'https://ghost.mysite.me/ghost/#/settings';
			return transformOptions(opts).then(res => {
				expect(res.url).to.equal('https://ghost.mysite.me/ghost/api/v0.1');
			});
		});

		it('https://ghost.mysite.me/ghost/api/v0.1/posts?limit=all#tests', function () {
			opts.url = 'https://ghost.mysite.me/ghost/api/v0.1/posts?limit=all#test';
			return transformOptions(opts).then(res => {
				expect(res.url).to.equal('https://ghost.mysite.me/ghost/api/v0.1');
			});
		});
	});

	it('requires themePath', function () {
		return transformOptions({url: 'https://ghost.blog', token: 'token'}).then(expectError).catch(error => {
			expect(error).to.be.instanceOf(DeployError);
			expect(error.message).to.equal('Theme path must be supplied');
		});
	});

	it('passes non-transformed options through', function () {
		const opts = {
			url: 'https://ghost.blog',
			username: 'username',
			password: 'password',
			id: 'cid',
			secret: 'secret',
			themePath: '/path/to/ghost',
			skipThemeValidation: true,
			activateTheme: true
		};

		return transformOptions(opts).then(options => {
			const expected = Object.assign({}, opts, {url: 'https://ghost.blog/ghost/api/v0.1'});
			// Make sure it's not making changes to the argument
			opts.peep = true;
			expect(options.peep).to.not.exist;
			expect(options).to.deep.equal(expected);
		});
	});
});

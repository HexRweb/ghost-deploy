const publish = require('./publish.js');

publish({
	url: 'http://localhost:2368',
	username: 'aggregator-bot@your-aggregator.blog',
	password: 'keepitreal',
	id: 'ghost-admin',
	secret: 'ada275f05a0e',
	themePath: 'C:/code/git/comet-blog-theme/comet-blog-theme.zip',
	skipThemeValidation: true
});

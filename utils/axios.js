const _axios = require('axios');
const {name, version, repository} = require('../package.json');

const AGENT = `${name}/${version} (${repository})`;

const axios = _axios.create({
	headers: {
		'user-agent': AGENT
	}
});

module.exports = axios;
module.exports.AGENT = AGENT;

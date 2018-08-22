const _axios = require('axios');
const {name, version, repository} = require('../package.json');

const AGENT = `${name}/${version} (${repository})`;

/*
 * ./utils/axios is a wrapper for axios (the HTTP Request library we use). It exports an extended
 * version of the axios library, using our user-agent (UA) string instead of the default axios UA.
 * because of some complications with the library, we also export the UA string as `exports.AGENT`
 * so other methods can create their own extended axios instance if needed.
*/
const axios = _axios.create({
	headers: {
		'user-agent': AGENT
	}
});

module.exports = axios;
module.exports.AGENT = AGENT;


const {createServer} = require('http');

const ghost401Error = '{"errors":[{"message":"Access denied.","context":"No client credentials","errorType":"UnauthorizedError"}]}';

const ghost403Error = '{"errors":[{"message":"Please Sign In","errorType":"NoPermissionError"}]}';

const respond = (req, res) => {
	if (req.url.indexOf('/401-no-data') === 0) {
		res.statusCode = 401;
		res.end('{}');
	} else if (req.url.indexOf('/401') === 0) {
		res.statusCode = 401;
		res.end(ghost401Error);
	} else if (req.url.indexOf('/403') === 0) {
		res.statusCode = 403;
		res.end(ghost403Error);
	} else {
		res.statusCode = 200;
		res.end('{}');
	}
};

module.exports = createServer(respond);

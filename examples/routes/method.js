
module.exports = {
	'/method': {
		get: get,
		post: post
	}
};

function get(req, res) {

	res.end('GET Method');
};

function post(req, res) {

	res.end('POST Method');
};

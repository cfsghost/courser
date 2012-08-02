
module.exports = {
	'/middleware': [
		DoSomethingBeforeHandler,
		middleware
	]
};

function DoSomethingBeforeHandler(req, res, next) {

	console.log('Do Something');

	next();
};

function middleware(req, res) {

	res.render('index', { title: 'Courser Example' });
};

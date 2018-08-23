let context;

const set = ctx => {
	context = ctx;
};

const get = () => {
	return context;
};

module.exports = { set, get };

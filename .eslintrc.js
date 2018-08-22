module.exports = {
	extends: 'airbnb-base/legacy',
	parser: 'babel-eslint',
	env: {
		node: true,
		es6: true
	},
	rules: {
		indent: [2, 'tab'],
		'no-tabs': 0,
		'no-console': 0,
		'global-require': 0,
		'prefer-promise-reject-errors': 0,
		'no-use-before-define': 0,
		'function-paren-newline': 0,
		'one-var': 0,
		'one-var-declaration-per-line': 0,
		'max-len': 0,
		'object-curly-newline': 0,
		'no-restricted-syntax': ['error', 'ForInStatement', 'LabeledStatement', 'WithStatement']
	}
};

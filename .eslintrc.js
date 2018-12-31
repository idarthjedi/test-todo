module.exports = {
	'env': {
		'es6': true,
		'node': true,
	},
	'extends': 'eslint:recommended',
	'parserOptions': {
		'ecmaVersion': 2018,
		'sourceType': 'module',
	},
	'plugins': [
		'mocha'
	],
	'rules':
		{
			"mocha/no-exclusive-tests": "error",
			'indent': [
				'error',
				'tab',
			],
			'linebreak-style': [
				'error',
				'windows',
			],
			'quotes': [
				'error',
				'single',
			],
			'semi': [
				'error',
				'always',
			],
		},
};
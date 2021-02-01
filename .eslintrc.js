module.exports = {

	// https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb-base/rules/style.js
	extends: [
		'eslint:recommended',
		//'airbnb-base',
		'plugin:react/recommended',
		'plugin:jsx-a11y/recommended',
		'plugin:react-hooks/recommended'
	],

	globals: {

		// CommonJS (CJS) format
		exports: false,
		module: false,

		// Node
		__dirname: false,
		require: false,

		// Nashorn
		Java: false,

		// Enonic XP
		app: false,
		log: false,
		resolve: false,
		__: false,

		// Mocha
		//describe: false,
		//it: false,

		// Client-side js
		console: false,
		document: false,
		fetch: false,
		setTimeout: false,
		window: false,

		// Jquery
		$: false,
		jQuery: false,

		// React
		React: false

	}, //globals

	parser: 'babel-eslint',

	parserOptions: {
		allowImportExportEverywhere: false,

		codeFrame: true,

		ecmaFeatures: {
			jsx: true
		},

		// set to 3, 5 (default), 6, 7, 8, 9, 10 or 11 to specify the version of ECMAScript syntax you want to use.
		// You can also set to 2015 (same as 6), 2016 (same as 7), 2017 (same as 8), 2018 (same as 9), 2019 (same as 10) or 2020 (same as 11) to use the year-based naming.
		//ecmaVersion: 2020, // 11
		ecmaVersion: 6, // 2015

		impliedStrict: true,

		// set to "script" (default) or "module" if your code is in ECMAScript modules.
		sourceType: 'module' // allow import statements
	},

	plugins: [
		'import',
		'react',
		'jsx-a11y'
	],

	rules: { // https://eslint.org/docs/rules
		'comma-dangle': ['error', {
			arrays: 'ignore',
			objects: 'never',
			imports: 'never',
			exports: 'never',
			functions: 'ignore'
		}],
		'import/extensions': ['off'],
		'import/prefer-default-export': ['off'],
		'import/no-absolute-path': ['off'],
		'import/no-extraneous-dependencies': ['off'],
		'import/no-unresolved': ['off'],
		indent: ['warn', 'tab'],
		'max-len': ['error', 160, 2, {
			ignoreUrls: true,
			ignoreComments: true,
			ignoreRegExpLiterals: true,
			ignoreStrings: true,
			ignoreTemplateLiterals: true
		}],
		'no-cond-assign': ['error', 'except-parens'],
		'no-multi-spaces': ['off'],
		'no-tabs': ['off'],
		'no-underscore-dangle': ['error', {
			allow: [
				'_id', // content-type property
				'_path', // content-type property
				'_selected' // option-set property
			],
			allowAfterThis: false,
			allowAfterSuper: false,
			enforceInMethodNames: false
		}],
		'object-curly-spacing': ['off'],
		'react/prop-types': ['off'],
		'spaced-comment': ['off']
	} // rules

} // module.exports

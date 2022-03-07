/* eslint-disable no-console */
//──────────────────────────────────────────────────────────────────────────────
// Imports
//──────────────────────────────────────────────────────────────────────────────
import glob from 'glob';
import path from 'path';
import {CleanWebpackPlugin} from 'clean-webpack-plugin';
import {
	ESBuildMinifyPlugin,
	ESBuildPlugin
} from 'esbuild-loader';
/*import jssCamelCase from 'jss-camel-case';
import jssDefaultUnit from 'jss-default-unit';
//import jssGlobal from 'jss-global';
import jssNested from 'jss-nested';
import jssPropsSort from 'jss-props-sort';
import jssVendorPrefixer from 'jss-vendor-prefixer';*/
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
//import postcssPresetEnv from 'postcss-preset-env';
//import {print} from 'q-i';
//import TerserPlugin from 'terser-webpack-plugin';
//import UglifyJsPlugin from 'uglifyjs-webpack-plugin'; // Supports ECMAScript2015
import webpack from 'webpack';

// Check which version of node is used
/*print({
	//env: process.env,
	execPath: process.execPath,
	version: process.version
}, { maxItems: Infinity });*/

//──────────────────────────────────────────────────────────────────────────────
// Common
//──────────────────────────────────────────────────────────────────────────────
//const MODE = 'production';
const MODE = 'development';

const JS_EXTENSION_GLOB_BRACE = '*.{es,es6,mjs,jsx,flow,js,ts}';
const ASSETS_PATH_GLOB_BRACE = '{site/assets,assets}';

const SRC_DIR = 'src/main/resources';
const DST_DIR = 'build/resources/main';

const context = path.resolve(__dirname, SRC_DIR);
const outputPath = path.join(__dirname, DST_DIR);

//'mjs',
//'jsx',
//'esm',
const serverSideExtensions = [
	'es',
	'es6',
	'ts',
	//'tsx',
	'js',
	'json'
];

const stats = {
	colors: true,
	entrypoints: false,
	hash: false,
	//maxModules: 0, // Removed in Webpack 5
	modules: false,
	moduleTrace: false,
	timings: false,
	version: false
};
const WEBPACK_CONFIG = [];

//──────────────────────────────────────────────────────────────────────────────
// Functions
//──────────────────────────────────────────────────────────────────────────────
//const toStr = (v) => JSON.stringify(v, null, 4);
const dict = (arr) => Object.assign(...arr.map(([k, v]) => ({ [k]: v })));

//──────────────────────────────────────────────────────────────────────────────
// Server-side Javascript
//──────────────────────────────────────────────────────────────────────────────
const TS_D_FILES = glob.sync(`${SRC_DIR}/**/*.d.ts`);
//print({TS_D_FILES}, { maxItems: Infinity });

const ALL_JS_ASSETS_GLOB = `${SRC_DIR}/${ASSETS_PATH_GLOB_BRACE}/**/${JS_EXTENSION_GLOB_BRACE}`;
//print({ALL_JS_ASSETS_GLOB}, { maxItems: Infinity });

const ALL_JS_ASSETS_FILES = glob.sync(ALL_JS_ASSETS_GLOB, {
	ignore: TS_D_FILES
});
//print({ALL_JS_ASSETS_FILES}, { maxItems: Infinity });

const SERVER_JS_FILES = glob.sync(`${SRC_DIR}/**/${JS_EXTENSION_GLOB_BRACE}`, {
	ignore: ALL_JS_ASSETS_FILES.concat(TS_D_FILES)
});
//print({SERVER_JS_FILES}, { maxItems: Infinity });

if (SERVER_JS_FILES.length) {
	const SERVER_JS_ENTRY = dict(SERVER_JS_FILES.map((k) => [
		k.replace(`${SRC_DIR}/`, '').replace(/\.[^.]*$/, ''), // name
		`.${k.replace(`${SRC_DIR}`, '')}` // source relative to context
	]));
	//print({SERVER_JS_ENTRY}, { maxItems: Infinity });

	const SERVER_JS_CONFIG = {
		context,
		entry: SERVER_JS_ENTRY,
		externals: [
			/^\//
		],
		devtool: false, // Don't waste time generating sourceMaps
		mode: MODE,
		module: {
			rules: [{
				/*exclude: [
					/\bcore-js\b/,
					/\bwebpack\b/,
					/\bregenerator-runtime\b/,
				],*/
				exclude: [ // It takes time to transpile, if you know they don't need transpilation to run in Enonic you may list them here:
					/node_modules[\\/]core-js/, // will cause errors if they are transpiled by Babel
					/node_modules[\\/]webpack[\\/]buildin/ // will cause errors if they are transpiled by Babel
				],
				test: /\.(es6?|ts|js)$/, // Will need js for node module depenencies
				use: [{
					loader: 'babel-loader',
					options: {
						babelrc: false, // The .babelrc file should only be used to transpile config files.
						comments: false,
						compact: false,
						minified: false,
						plugins: [
							//'import-css-to-jss', // NOTE This will hide the css from MiniCssExtractPlugin!
							//'optimize-starts-with', https://github.com/xtuc/babel-plugin-optimize-starts-with/issues/1
							//'transform-prejss',
							'@babel/plugin-transform-arrow-functions',
							'@babel/plugin-proposal-class-properties',
							'@babel/plugin-proposal-export-default-from', // export v from 'mod'; // I think it adds a default export
							'@babel/plugin-proposal-export-namespace-from', // export * as ns from 'mod';
							'@babel/plugin-proposal-object-rest-spread',
							'@babel/plugin-syntax-dynamic-import', // Allow parsing of import()
							'@babel/plugin-syntax-throw-expressions',
							'@babel/plugin-transform-block-scoped-functions',
							'@babel/plugin-transform-block-scoping',
							'@babel/plugin-transform-classes',
							'@babel/plugin-transform-computed-properties',
							'@babel/plugin-transform-destructuring',
							'@babel/plugin-transform-duplicate-keys',
							'@babel/plugin-transform-for-of',
							'@babel/plugin-transform-function-name',
							'@babel/plugin-transform-instanceof',
							'@babel/plugin-transform-literals',
							'@babel/plugin-transform-new-target',
							'@babel/plugin-transform-member-expression-literals',
							'@babel/plugin-transform-modules-commonjs', // transforms ECMAScript modules to CommonJS
							'@babel/plugin-transform-object-assign', // Not used locally, perhaps in node_modules?
							'@babel/plugin-transform-object-super',
							'@babel/plugin-transform-parameters',
							'@babel/plugin-transform-property-literals',
							'@babel/plugin-transform-property-mutators',
							'@babel/plugin-transform-reserved-words',
							'@babel/plugin-transform-shorthand-properties',
							'@babel/plugin-transform-spread',
							'@babel/plugin-transform-sticky-regex',
							'@babel/plugin-transform-template-literals',
							'@babel/plugin-transform-typeof-symbol',
							'@babel/plugin-transform-unicode-escapes', // This plugin is included in @babel/preset-env
							'@babel/plugin-transform-unicode-regex',
							'array-includes'
						],
						presets: [
							'@babel/preset-typescript',
							[
								'@babel/preset-env',
								{
									corejs: 3,

									// Enables all transformation plugins and as a result,
									// your code is fully compiled to ES5
									forceAllTransforms: true,

									targets: {
										esmodules: false, // Enonic XP doesn't support ECMAScript Modules
										// https://node.green/
										node: '0.10.48'
									},
									//useBuiltIns: false // no polyfills are added automatically
									useBuiltIns: 'entry' // replaces direct imports of core-js to imports of only the specific modules required for a target environment
									//useBuiltIns: 'usage' // polyfills will be added automatically when the usage of some feature is unsupported in target environment
								}
							]
						]
					} // options
				}]
			}]
		}, // module
		optimization: {
			//mangleExports: 'deterministic', // By default optimization.mangleExports: 'deterministic' is enabled in production mode and disabled elsewise.
			mangleExports: false,
			//minimize: false,
			minimizer: [
				/*new TerserPlugin({
					terserOptions: {
						compress: {
							drop_console: false
						},
						keep_classnames: true,
						keep_fnames: true
					}
				})*/
				/*new UglifyJsPlugin({
					parallel: true, // highly recommended
					sourceMap: false
				})*/
			],
			//usedExports: true // Determine used exports for each module and don't generate code for unused exports aka Dead code elimination.
			usedExports: false // Don't determine used exports for each module, no dead code removal
			//usedExports: 'global' // To opt-out from used exports analysis per runtime
		},
		output: {
			path: outputPath,
			filename: '[name].js',
			libraryTarget: 'commonjs'
		}, // output
		performance: {
			hints: false
		},
		plugins: [
			new webpack.ProvidePlugin({
				Buffer: ['buffer', 'Buffer'],
				global: 'myGlobal'
			})
		],
		resolve: {
			alias: {
				'@enonic/nashorn-polyfills': path.resolve(__dirname, 'src/main/resources/lib/nashorn/index.es'),
				myGlobal: path.resolve(__dirname, 'src/main/resources/lib/nashorn/global')
			},
			extensions: serverSideExtensions.map((ext) => `.${ext}`)/*,
			fallback: {
				//buffer: false // Don't polyfill buffer since we're not running in Node? NO, Nashorn doesn't have buffer either.
				buffer: require.resolve('buffer/') // Polyfill buffer since Nashorn doesn't provide it.
			}*/
		}, // resolve
		stats
	};
	//console.log(`SERVER_JS_CONFIG:${JSON.stringify(SERVER_JS_CONFIG, null, 4)}`);
	WEBPACK_CONFIG.push(SERVER_JS_CONFIG);
}

//──────────────────────────────────────────────────────────────────────────────
// Styling
//──────────────────────────────────────────────────────────────────────────────
const STYLE_USE = [
	MiniCssExtractPlugin.loader,
	{
		loader: 'css-loader', // translates CSS into CommonJS
		options: { importLoaders: 1 }
	}, {
		loader: 'postcss-loader',
		/*options: { // postcss-loader 3.x
			ident: 'postcss',
			plugins: () => [postcssPresetEnv()]
		}*/
		options: { // postcss-loader 4.x
			postcssOptions: {
				plugins: [
					[
						'postcss-preset-env',
						{
							// Options
						}
					]
				]
			}
		}
	}
];

const EXCLUDE = [
	///\bcore-js\b/,
	/node_modules/
	///\bwebpack\b/,
	///\bregenerator-runtime\b/,
];

const STYLE_CONFIG = {
	context: path.resolve(__dirname, SRC_DIR, 'assets/style'),
	entry: './index.es',
	mode: MODE,
	module: {
		rules: [{
			exclude: EXCLUDE,
			test: /\.(c|le|sa|sc)ss$/,
			use: [
				...STYLE_USE,
				'less-loader', // compiles Less to CSS
				'sass-loader' // compiles Sass to CSS
			]
		}, /*{
			test: /\.jss.js$/,
			use: [
				...STYLE_USE, {
					loader: 'jss-loader', // compiles JSS to CSS
					options: {
						plugins: [
							jssCamelCase,
							jssDefaultUnit,
							//jssGlobal,
							jssNested,
							jssPropsSort,
							jssVendorPrefixer
						]
					}
				}
			]
		}, {
			test: /\.jss.js$/,
			exclude: /node_modules/,
			use: [
				...STYLE_USE, {
					loader: 'jss-sheet-loader', // compiles JSS to CSS?
					options: {
						injectKeywords: true,
						plugins: [
							'jss-nested'
						]
					}
				}
			]
		}, */{
			exclude: EXCLUDE,
			test: /\.styl$/,
			use: [
				...STYLE_USE,
				'stylus-loader', // compiles Stylus to CSS
			]
		}, {
			exclude: EXCLUDE,
			test: /\.svg/,
			use: {
				loader: 'svg-url-loader',
				options: {}
			}
		}, {
			exclude: EXCLUDE,
			test: /\.(es6?|js)$/, // Will need js for node module depenencies
			use: [{
				loader: 'babel-loader',
				options: {
					babelrc: false, // The .babelrc file should only be used to transpile config files.
					comments: false,
					compact: false,
					minified: false,
					plugins: [
						'array-includes',
						//'import-css-to-jss', // NOTE This will hide the css from MiniCssExtractPlugin!
						//'optimize-starts-with', https://github.com/xtuc/babel-plugin-optimize-starts-with/issues/1
						//'transform-prejss',
						'@babel/plugin-proposal-object-rest-spread',
						'@babel/plugin-transform-object-assign'
					],
					presets: [
						[
							'@babel/preset-env',
							{
								corejs: 3, // Needed when useBuiltIns: usage

								// Enables all transformation plugins and as a result,
								// your code is fully compiled to ES5
								forceAllTransforms: true,

								targets: {
									esmodules: false, // Enonic XP doesn't support ECMAScript Modules

									// https://node.green/
									node: '0.10.48'
								},
								//useBuiltIns: false // no polyfills are added automatically
								//useBuiltIns: 'entry' // replaces direct imports of core-js to imports of only the specific modules required for a target environment
								useBuiltIns: 'usage' // polyfills will be added automatically when the usage of some feature is unsupported in target environment
							}
						]
					]
				} // options
			}]
		}]
	}, // module
	optimization: {
		//mangleExports: 'deterministic', // By default optimization.mangleExports: 'deterministic' is enabled in production mode and disabled elsewise.
		mangleExports: false,
		minimizer: [
			/*new TerserPlugin({
				terserOptions: {
					compress: {
						drop_console: false
					},
					keep_classnames: true,
					keep_fnames: true
				}
			})*/
		],
		//usedExports: true // Determine used exports for each module and don't generate code for unused exports aka Dead code elimination.
		usedExports: false // Don't determine used exports for each module, no dead code removal
		//usedExports: 'global' // To opt-out from used exports analysis per runtime
	},
	output: {
		path: path.join(__dirname, '.build')
	},
	plugins: [
		new CleanWebpackPlugin(
			{
				cleanOnceBeforeBuildPatterns: [
					path.join(__dirname, '.build')
				],
				verbose: true
			}
		),
		new MiniCssExtractPlugin({
			filename: `../${DST_DIR}/assets/style.css`
		})
	],
	resolve: {
		extensions: ['.sass', '.scss', '.less', '.styl', '.css']
	},
	stats
};
//console.log(`STYLE_CONFIG:${JSON.stringify(STYLE_CONFIG, null, 4)}`);

WEBPACK_CONFIG.push(STYLE_CONFIG);

//──────────────────────────────────────────────────────────────────────────────
const ESBUILD_TARGET = 'es2015';
const ESM_ASSETS_GLOB = `${SRC_DIR}/${ASSETS_PATH_GLOB_BRACE}/**/*.{jsx,mjs}`;
const ESM_ASSETS_FILES = glob.sync(ESM_ASSETS_GLOB);
//console.log(`ESM_ASSETS_FILES:${toStr(ESM_ASSETS_FILES)}`);

if (ESM_ASSETS_FILES.length) {
	const ASSETS_ESM_ENTRY = dict(ESM_ASSETS_FILES.map((k) => [
		k.replace(`${SRC_DIR}/assets/`, '').replace(/\.[^.]*$/, ''), // name
		`.${k.replace(`${SRC_DIR}/assets`, '')}` // source relative to context
	]));
	//console.log(`ASSETS_ESM_ENTRY:${toStr(ASSETS_ESM_ENTRY)}`);

	const ASSETS_ESM_CONFIG = {
		context: path.resolve(__dirname, SRC_DIR, 'assets'),
		entry: ASSETS_ESM_ENTRY,
		experiments: {
			outputModule: true
		},
		mode: MODE,
		module: {
			rules: [{
				exclude: [ // It takes time to transpile, if you know they don't need transpilation to run in Enonic you may list them here:
					/node_modules[\\/]core-js/, // will cause errors if they are transpiled by Babel
					/node_modules[\\/]webpack[\\/]buildin/ // will cause errors if they are transpiled by Babel
				],
				test: /\.jsx$/,
				loader: 'esbuild-loader',
				options: {
					loader: 'jsx',
					target: ESBUILD_TARGET
				}
			}, {
				exclude: [ // It takes time to transpile, if you know they don't need transpilation to run in Enonic you may list them here:
					/node_modules[\\/]core-js/, // will cause errors if they are transpiled by Babel
					/node_modules[\\/]webpack[\\/]buildin/ // will cause errors if they are transpiled by Babel
				],
				test: /\.tsx?$/,
				loader: 'esbuild-loader',
				options: {
					loader: 'tsx',
					target: ESBUILD_TARGET
				}
			}]
		}, // module
		optimization: {
			//mangleExports: 'deterministic', // By default optimization.mangleExports: 'deterministic' is enabled in production mode and disabled elsewise.
			mangleExports: false,
			minimize: MODE === 'production',
			minimizer: MODE === 'production' ? [
				new ESBuildMinifyPlugin({
					target: ESBUILD_TARGET
				})
			] : [],
			//usedExports: true // Determine used exports for each module and don't generate code for unused exports aka Dead code elimination.
			usedExports: false // Don't determine used exports for each module, no dead code removal
			//usedExports: 'global' // To opt-out from used exports analysis per runtime
		},
		output: {
			path: path.join(__dirname, DST_DIR, 'assets'),
			filename: '[name].mjs',

			//library: 'MyLibrary',
			//libraryTarget: 'window' // The return value of your entry point will be assigned to the window object using the output.library value.

			library: {
				type: 'module'
			}

			//libraryTarget: 'amd' // This will expose your library as an AMD module.
			//libraryTarget: 'amd-require' // This packages your output with an immediately-executed AMD require(dependencies, factory) wrapper.
			//libraryTarget: 'assign' // This will generate an implied global which has the potential to reassign an existing value (use with caution).

			// The return value of your entry point will be assigned to the exports object using the output.library value. As the name implies, this is used in CommonJS environments.
			//libraryTarget: 'commonjs' // Uncaught ReferenceError: exports is not defined

			// The return value of your entry point will be assigned to the module.exports. As the name implies, this is used in CommonJS environments
			//libraryTarget: 'commonjs2' // Uncaught ReferenceError: module is not defined

			//libraryTarget: 'esm' // Error: Unsupported library type esm.

			//libraryTarget: 'jsonp' // This will wrap the return value of your entry point into a jsonp wrapper.

			//libraryTarget: 'global' // The return value of your entry point will be assigned to the global object using the output.library value.
			//libraryTarget: 'system' // System modules require that a global variable System is present in the browser when the webpack bundle is executed.
			//libraryTarget: 'this' // The return value of your entry point will be assigned to this under the property named by output.library. The meaning of this is up to you
			//libraryTarget: 'var' // (default) When your library is loaded, the return value of your entry point will be assigned to a variable
			//libraryTarget: 'umd'
		},
		performance: {
			hints: false
		},
		plugins: [
			new ESBuildPlugin()
		],
		resolve: {
			extensions: [
				'mjs', 'jsx', 'tsx', 'esm', 'es', 'es6', 'js', 'json', 'ts'
			].map(ext => `.${ext}`)
		}, // resolve
		stats
	};
	//console.log(`ASSETS_ESM_CONFIG:${toStr(ASSETS_ESM_CONFIG)}`);
	WEBPACK_CONFIG.push(ASSETS_ESM_CONFIG);
}

//──────────────────────────────────────────────────────────────────────────────
// Exports
//──────────────────────────────────────────────────────────────────────────────
//console.log(`WEBPACK_CONFIG:${JSON.stringify(WEBPACK_CONFIG, null, 4)}`);
//process.exit();

export { WEBPACK_CONFIG as default };

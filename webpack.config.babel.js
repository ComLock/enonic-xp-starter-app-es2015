/* eslint-disable no-console */
//──────────────────────────────────────────────────────────────────────────────
// Imports
//──────────────────────────────────────────────────────────────────────────────
import glob from 'glob';
import path from 'path';


//──────────────────────────────────────────────────────────────────────────────
// Common
//──────────────────────────────────────────────────────────────────────────────
const JS_EXTENSION_GLOB_BRACE = '*.{es,es6,mjs,jsx,flow,js}';
const ASSETS_PATH_GLOB_BRACE = '{site/assets,assets}';

const SRC_DIR = 'src/main/resources';
const DST_DIR = 'build/resources/main';

const context = path.resolve(__dirname, SRC_DIR);
const extensions = ['.es', '.js', '.json']; // used in resolve
const outputPath = path.join(__dirname, DST_DIR);


//──────────────────────────────────────────────────────────────────────────────
// Functions
//──────────────────────────────────────────────────────────────────────────────
//const toStr = v => JSON.stringify(v, null, 4);
const dict = arr => Object.assign(...arr.map(([k, v]) => ({ [k]: v })));


//──────────────────────────────────────────────────────────────────────────────
// Server-side Javascript
//──────────────────────────────────────────────────────────────────────────────
const ALL_JS_ASSETS_GLOB = `${SRC_DIR}/${ASSETS_PATH_GLOB_BRACE}/**/${JS_EXTENSION_GLOB_BRACE}`;
//console.log(`ALL_JS_ASSETS_GLOB:${toStr(ALL_JS_ASSETS_GLOB)}`);

const ALL_JS_ASSETS_FILES = glob.sync(ALL_JS_ASSETS_GLOB);
//console.log(`ALL_JS_ASSETS_FILES:${toStr(ALL_JS_ASSETS_FILES)}`);

const SERVER_JS_FILES = glob.sync(`${SRC_DIR}/**/${JS_EXTENSION_GLOB_BRACE}`, {
    ignore: ALL_JS_ASSETS_FILES
});
//console.log(`SERVER_JS_FILES:${toStr(SERVER_JS_FILES)}`);

const SERVER_JS_ENTRY = dict(SERVER_JS_FILES.map(k => [
    k.replace(`${SRC_DIR}/`, '').replace(/\.[^.]*$/, ''), // name
    `.${k.replace(`${SRC_DIR}`, '')}` // source relative to context
]));
//console.log(`SERVER_JS_ENTRY:${toStr(SERVER_JS_ENTRY)}`);

const SERVER_JS_CONFIG = {
    context,
    entry: SERVER_JS_ENTRY,
    externals: [
        /\/lib\/(enonic|xp)/
    ],
    devtool: false, // Don't waste time generating sourceMaps
    module: {
        rules: [{
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
                        'optimize-starts-with',
                        'transform-object-assign',
                        'transform-object-rest-spread'
                    ],
                    presets: ['es2015']
                } // options
            }] // use
        }] // rules
    }, // module
    output: {
        path: outputPath,
        filename: '[name].js',
        libraryTarget: 'commonjs'
    }, // output
    resolve: {
        alias: {
            '/lib': path.resolve(__dirname, SRC_DIR, 'lib'),
            '/site': path.resolve(__dirname, SRC_DIR, 'site'),
            '/services': path.resolve(__dirname, SRC_DIR, 'services')
        },
        extensions
    } // resolve
};
//console.log(`SERVER_JS_CONFIG:${JSON.stringify(SERVER_JS_CONFIG, null, 4)}`);


//──────────────────────────────────────────────────────────────────────────────
// Exports
//──────────────────────────────────────────────────────────────────────────────
const WEBPACK_CONFIG = [
    SERVER_JS_CONFIG
];

//console.log(`WEBPACK_CONFIG:${JSON.stringify(WEBPACK_CONFIG, null, 4)}`);
//process.exit();

export { WEBPACK_CONFIG as default };

/* eslint-disable no-unused-vars */


import css from './css/index.css';

/*
ERROR in ./jss/index.jss.js
    Module build failed (from node_modules/mini-css-extract-plugin/dist/loader.js):
    ModuleBuildError: Module build failed (from node_modules/jss-loader/index.js):
    TypeError: Cannot read property 'jssLoader' of undefined
        at Object.module.exports (node_modules/jss-loader/index.js:16:27)
var styles = require('css?modules!jss!./jss/index.jss.js');
import jss from './jss/index.jss.js';
*/

import less from './less/index.less';
import sass from './sass/index.sass';
import scss from './scss/index.scss';
import styl from './stylus/index.styl';

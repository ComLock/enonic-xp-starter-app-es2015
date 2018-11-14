module.exports = {

    // https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb-base/rules/style.js
    extends: 'airbnb-base',

    globals: {

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
        //console: false,
        document: false,
        window: false,

        // Jquery
        $: false,
        jQuery: false,

    }, //globals

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
                ignoreTemplateLiterals: true,
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
                enforceInMethodNames: false,
            }],
            'object-curly-spacing': ['off'],
            'spaced-comment': ['off']
        } // rules

} // module.exports

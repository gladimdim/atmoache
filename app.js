requirejs.config({
    paths: {
        es6: "../node_modules/requirejs-babel/es6",
        babel: "../node_modules/requirejs-babel/babel-4.6.6.min"
    },
    'config': {
        'es6': {
            'resolveModuleSource': function(source) {
                return 'es6!'+source;
            }
        }
    }
});

requirejs(['es6!./atmoapp/main']);
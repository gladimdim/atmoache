requirejs.config({
    baseUrl: 'lib',
    paths: {
    	atmoapp: "../build",
    }
});

requirejs(['atmoapp/main']);
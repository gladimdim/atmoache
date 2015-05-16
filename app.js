requirejs.config({
    baseUrl: 'lib',
    paths: {
    	atmoapp: "../atmoapp",
    }
});

requirejs(['atmoapp/main']);
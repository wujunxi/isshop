require.config({
    baseUrl: '/scripts/lib',
    paths: {
        jquery: 'jquery-1.8.0.min'
    },
    //- 非标准AMD
    shim: {
        'jquery.md5': {
            deps: ['jquery'],
            exports: 'jQuery.md5'
        }
    }
});
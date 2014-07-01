requirejs.config({
    baseUrl: '/dist',
    deps: ['../boot'],

    paths: {
        jquery: '/lib/jquery/dist/jquery.min',
        lodash: '/lib/lodash/dist/lodash.min',
        knockout: '/lib/knockout/dist/knockout'
    }
});
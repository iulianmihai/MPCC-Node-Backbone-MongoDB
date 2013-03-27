require.config({
    paths:{
        jQuery:'//cdnjs.cloudflare.com/ajax/libs/jquery/1.9.1/jquery.min',
        Underscore:'//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore-min',
        Backbone:'//cdnjs.cloudflare.com/ajax/libs/backbone.js/0.9.10/backbone-min',
        Sockets:'/socket.io/socket.io',
        models:'models',
        text:'//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.3/text',
        templates:'../templates',
        BaseView: '/js/BaseView'
    },
    shim:{
        'Backbone':['Underscore', 'jQuery'],
        'MpccConnect':['Backbone']
    }
});

require(['MpccConnect'], function (MpccConnect) {
    $(document).ajaxError(function(e, xhr, settings, exception) {
        if(xhr.status==401) {
            window.location.hash = '#login';
        }
    });
    MpccConnect.initialize();
});
define([
    'router',
    'MpccSockets'
], function (Router, Socket) {
    var initialize = function (){
        Socket.initialize(Router.socketEvents);
        checkLogin(runApplication);
    };

    var checkLogin = function (callback) {
        $.ajax('/account/authenticated', {
            method:'GET',
            success:function (data) {
                Router.socketEvents.trigger('app:loggedin', data);
                return callback(true);
            },
            error:function (data) {
                return callback(false);
            }
        });
    };

    var runApplication = function (authenticated) {
        if (authenticated) {
            window.location.hash = 'index';
        } else {
            window.location.hash = 'login';
        }
        Backbone.history.start();
    };



    return{
        initialize:initialize
    };
});
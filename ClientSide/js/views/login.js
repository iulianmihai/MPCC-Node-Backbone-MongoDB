define(['BaseView',
        'text!templates/login.html'
], function (BaseView,loginTemplate) {
    return BaseView.extend({
        requireLogin: false,

        el:$('#content'),

        initialize: function(options){
            this.socketEvents = options.socketEvents;
        },

        render:function () {
            this.$el.html(loginTemplate);
            $('#error').hide();
            $("input[name=email]").focus();
        },

        events:{
            'submit form':'login'
        },

        login:function () {
            var socketEvents = this.socketEvents;
            $.post('/login',
                this.$('form').serialize(), function(data) {
                socketEvents.trigger('app:loggedin', data);
                window.location.hash = 'index';
            }).error(function(){
                    $('#error').text('Unable to login.').slideDown();
                    $('input[name=email]').val('');
                    $('input[name=password]').val('');
            });
            return false;
        }
    });
});
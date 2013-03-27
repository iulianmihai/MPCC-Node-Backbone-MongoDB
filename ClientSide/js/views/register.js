define(['BaseView',
        'text!templates/register.html'
], function (BaseView, registerTemplate) {
    return BaseView.extend({

        requireLogin: false,

        el:$('#content'),

        render:function () {
            this.$el.html(registerTemplate);
        },

        events:{
            'submit form':'register'
        },

        register:function () {
            $.post('/register', {
                firstName:$('input[name=firstName]').val(),
                lastName:$('input[name=lastName]').val(),
                email:$('input[name=email]').val(),
                password:$('input[name=password]').val()
            }, function (data) {
                console.log(data);
                $('input[name=firstName]').val('');
                $('input[name=lastName]').val('');
                $('input[name=email]').val('');
                $('input[name=password]').val('');
            });
            return false;
        }
    });
});
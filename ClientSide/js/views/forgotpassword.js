define(['BaseView',
        'text!templates/forgotpassword.html'
], function (BaseView, forgotPasswordTemplate) {
    return BaseView.extend({

        requireLogin: false,

        el:$('#content'),

        render:function () {
            this.$el.html(forgotPasswordTemplate);
        },

        events:{
            'submit form':'password'
        },

        password:function () {
            $.post('/forgotpassword', {
                email:$('input[name=email]').val()
            }, function (data) {
                console.log(data);
            });
            return false;
        }
    });
});
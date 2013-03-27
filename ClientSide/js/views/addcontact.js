define([
    'BaseView',
    'models/contact',
    'views/contact',
    'text!templates/addcontact.html'
], function(BaseView, Contact, ContactView, addContactTemplate){
    return BaseView.extend({
        el:$('#content'),

        render:function(resultList){
            var self = this;
            this.$el.html(_.template(addContactTemplate));
            if (null != resultList) {
                _.each(resultList, function(contactJson){
                   var contactModel = new Contact(contactJson);
                    var contactHtml = (new ContactView({
                        addButton:true,
                        model:contactModel
                    })).render().el;
                    $('#results').append(contactHtml);
                });
            }
        },

        events:{
            'submit form':'search'
        },

        search:function(){
            var self = this;
            $.post('/contacts/find',
                this.$('form').serialize(), function(data) {
                    self.render(data);
                    $('input[name=searchStr]').val('');
                }).error(function(){
                    $("#results").text('No contacts found with name/email: "' + $('input[name=searchStr]').val()+'"').slideDown();
                    $('input[name=searchStr]').val('');
                });

            return false;
        }
    });
});
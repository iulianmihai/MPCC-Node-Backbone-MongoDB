define([
    'BaseView',
    'text!templates/profile.html',
    'text!templates/status.html',
    'models/status',
    'views/status'
], function (BaseView, profileTemplate, statusTemplate, Status, StatusView) {
    return BaseView.extend({

       el:$('#content'),

        initialize:function(options){
            this.socketEvents = options.socketEvents;
            this.model.bind('change', this.render, this);
        },

        events:{
            'submit form':'postStatus'
        },

        render:function(){
            var self = this;

            if(this.model.get('_id')){
                this.socketEvents.bind('status:'+ this.model.get('_id'), this.onSocketStatusAdded, this);
            }

            this.$el.html(
                _.template(profileTemplate,this.model.toJSON())
            );

            var statusCollection = this.model.get('status');
            if(null != statusCollection) {
                _.each(statusCollection, function(statusJson){
                    var statusModel = new Status(statusJson);
                    self.prependStatus(statusModel);
                });
            }
        },

        onSocketStatusAdded: function(data) {
            var newStatus = data.data;
            this.prependStatus(new Status({status:newStatus.status,name:newStatus.name}))
        },

        postStatus:function(){
            var self = this;
            var statusText = $('input[name=status]').val();
            var statusCollection = this.collection;
            $.post('/accounts/' + this.model.get('_id') + '/status', {
                status: statusText
            }, function(data) {
                //self.prependStatus(new Status({status:statusText}));
                $('input[name=status]').val('');
            });
            return false;
        },

        prependStatus:function(statusModel){
            var statusHtml = (new StatusView({model:statusModel})).render().el;
            $(statusHtml).prependTo('.status_list').hide().fadeIn('slow');
        }
    });
});
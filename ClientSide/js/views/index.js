define([
    'BaseView',
    'text!templates/index.html',
    'views/status',
    'models/status',
    'models/statusCollection'
],
    function (BaseView, indexTemplate, StatusView, Status, StatusCollection) {
        return BaseView.extend({
            el:$('#content'),

            events:{
                "submit form":"updateStatus"
            },

            initialize:function (options) {
                var statusCollection = new StatusCollection();
                statusCollection.url = '/accounts/me/activity';
                statusCollection.fetch();
                this.collection = statusCollection;
                options.socketEvents.bind('status:me', this.onSocketStatusAdded, this);
                this.collection.on('add', this.onStatusAdded, this);
                this.collection.on('reset', this.onStatusCollectionReset, this);
            },

            onSocketStatusAdded: function(data){
                var newStatus = data.data;
                var found = false;
                this.collection.forEach(function(status) {
                    var name = status.get('name');
                    if ( name && name.full == newStatus.name.full && status.get('status') == newStatus.status ) {
                        found = true;
                    }
                });
                if (!found ) {
                    this.collection.add(new Status({status:newStatus.status,name:newStatus.name}))
                }
            },

            onStatusCollectionReset:function (collection) {
                var self = this;
                collection.each(function (model) {
                    self.onStatusAdded(model);
                });
            },

            onStatusAdded:function (status) {
                var statusHtml = (new StatusView({model:status})).render().el;
                $(statusHtml).prependTo('.status_list').hide().fadeIn('slow');
            },

            updateStatus:function () {
                var statusText = $('input[name=status]').val();
                var statusCollection = this.collection;
                $.post('/accounts/me/status', {
                    status:statusText
                }, function (data) {
                    //statusCollection.add(new Status({status:statusText}));
                    $('input[name=status]').val('');
                });
                return false;
            },

            render:function () {
                this.$el.html(indexTemplate);
            }
        });
    }
);
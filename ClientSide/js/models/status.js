define(function(require){
    return Backbone.Model.extend({
        urlRoot: '/accounts/' + this.accountId + '/status'
    });
});
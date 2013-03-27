define(['models/status'], function(Status) {
   return Backbone.Collection.extend({
        model: Status
    });
});
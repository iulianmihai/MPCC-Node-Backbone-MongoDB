define(['models/contact'], function(Contact){
    return Backbone.Collection.extend({
        model:Contact
    });
});
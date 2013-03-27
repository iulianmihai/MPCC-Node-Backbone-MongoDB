define([
    'BaseView',
    'text!templates/status.html'
], function(BaseView, statusTemplate) {
    return BaseView.extend({
        tagName: 'li',

        render: function() {
            $(this.el).html(_.template(statusTemplate,this.model.toJSON()));
            return this;
        }
    });
});
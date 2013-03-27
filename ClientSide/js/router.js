define([
    'views/index',
    'views/register',
    'views/login',
    'views/forgotpassword',
    'views/profile',
    'views/addcontact',
    'views/contacts',
    'models/account',
    'models/statusCollection',
    'models/contactCollection'
], function(IndexView, RegisterView, LoginView, ForgotPasswordView, ProfileView, AddContactView,ContactsView, Account, StatusCollection, ContactCollection){
    var RouterView = Backbone.Router.extend({

        currentView:null,

        socketEvents:_.extend({}, Backbone.Events),

        routes:{
            'addcontact':'addcontact',
            'index':'index',
            'login':'login',
            'register':'register',
            'forgotpassword':'forgotPassword',
            'profile/:id':'profile',
            'contacts/:id':'contacts'

        },

        changeView: function(view){
            if(null != this.currentView) {
                this.currentView.undelegateEvents();
            }
            this.currentView = view;
            this.currentView.render();
            $('#content').hide().fadeIn('slow');
        },

        index: function(){
            var self=this;
          // var statusCollection = new StatusCollection();
           // statusCollection.url = '/accounts/me/activity';
            self.changeView(new IndexView({
               // collection: statusCollection,
                socketEvents:self.socketEvents
            }));
          // statusCollection.fetch();
        },

        login: function(){
           this.changeView(new LoginView({
               socketEvents:this.socketEvents
           }));
        },

        forgotPassword: function(){
            this.changeView(new ForgotPasswordView());
        },

        register: function(){
            this.changeView(new RegisterView());
        },

        profile: function(id) {
            var model = new Account({id:id});
            this.changeView(new ProfileView({
                model:model,
                socketEvents:this.socketEvents
            }));
            model.fetch();
        },

        addcontact:function(){
            this.changeView(new AddContactView());
        },

        contacts: function(id){
            var contactId = id ? id : 'me';
            var contactsCollection = new ContactCollection();
            contactsCollection.url = '/accounts/' + contactId + '/contacts';
            this.changeView(new ContactsView({
                collection:contactsCollection
            }));
            contactsCollection.fetch();
        },

        errorHandler: function(model, error) {
            if (error.status == 401 || error.status == 403) {
                window.location.hash='login';
            }
        }

    });
    return new RouterView;
});
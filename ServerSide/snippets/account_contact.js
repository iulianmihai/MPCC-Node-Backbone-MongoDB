var schemaOptions = {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
};

var Contact = new mongoose.Schema({
    name: {
        first:   { type: String },
        last:    { type: String }
    },
    accountId: { type: mongoose.Schema.ObjectId },
    added:     { type: Date },
    updated:   { type: Date }
}, schemaOptions);

Contact.virtual('online').get(function(){
    return app.isAccountOnline(this.get('accountId'));
});

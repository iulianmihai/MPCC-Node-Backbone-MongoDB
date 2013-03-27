module.exports = function (app, models) {

    app.get('/accounts/:id/contacts', function (req, res) {
        if (req.session && req.session.loggedIn) {
            var accountId = req.params.id == 'me'
                ? req.session.accountId
                : req.params.id;
            models.Account.findById(accountId, function (account) {

                res.send(account.contacts);
            });
        } else {
            res.send(401);
        }
    });

    app.delete('/accounts/:id/contact', function (req, res) {
        if (req.session && req.session.loggedIn) {
            var accountId = req.params.id == 'me'
                ? req.session.accountId
                : req.params.id;
            var contactId = req.param('contactId', null);

            if (null == contactId) {
                res.send(400);
                return;
            }

            models.Account.findById(accountId, function (account) {
                if (!account) return;
                models.Account.findById(contactId, function (contact, err) {
                    if (!contact) return;
                    models.Account.removeContact(account, contactId);
                    models.Account.removeContact(contact, accountId);
                });
            });
            //Te response should not be in the callback because this endpoint return immediately and precess in the background
            res.send(200);
        } else {
            res.send(401);
        }
    });

    app.post('/accounts/:id/contact', function (req, res) {
        if (req.session && req.session.loggedIn) {
            var accountId = req.params.id == 'me'
                ? req.session.accountId
                : req.params.id;
            var contactId = req.param('contactId', null);

            if (null == contactId) {
                res.send(400);
                return;
            }

            models.Account.findById(accountId, function (account) {
                if (account) {
                    models.Account.findById(contactId, function (contact) {
                        models.Account.addContact(account, contact);
                        models.Account.addContact(contact, account);
                        account.save();
                    });
                }
            });
            //Te response should not be in the callback because this endpoint return immediately and precess in the background
            res.send(200);
        } else {
            res.send(401);
        }
    });

    app.post('/contacts/find', function (req, res) {
        if (req.session && req.session.loggedIn) {
            var searchStr = req.param('searchStr', null);
            if (null == searchStr) {
                res.send(400);
                return;
            }

            models.Account.findByString(searchStr, function onSearchDone(err, accounts) {
                if (err || accounts.length == 0) {
                    res.send(404);
                } else {
                    res.send(accounts);
                }
            });
        } else {
            res.send(401);
        }
    });
};
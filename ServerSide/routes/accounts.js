module.exports = function (app, models) {

    app.get('/accounts/:id/activity', function (req, res) {
        if (req.session && req.session.loggedIn) {
            var accountId = req.params.id == 'me'
                ? req.session.accountId
                : req.params.id;
            models.Account.findById(accountId, function (account) {
                res.send(account.activity);
            });
        } else {
            res.send(401);
        }
    });

    app.get('/accounts/:id/status', function (req, res) {
        if (req.session && req.session.loggedIn) {
            var accountId = req.params.id == 'me'
                ? req.session.accountId
                : req.params.id;
            models.Account.findById(accountId, function (account) {
                res.send(account.status);
            });
        } else {
            res.send(401);
        }
    });

    app.post('/accounts/:id/status', function (req, res) {
        if (req.session && req.session.loggedIn) {
            var accountId = req.params.id == 'me'
                ? req.session.accountId
                : req.params.id;
            models.Account.findById(accountId, function (account) {
                var status = {
                    name: account.name,
                    status: req.param('status', '')
                };
                account.status.push(status);

                // Push the status to all friends
                account.activity.push(status);
                account.save(function (err) {
                    if (err) {
                        console.log('Error saving account: ' + err);
                    } else {
                        app.triggerEvent('event:' + accountId, {
                            from: accountId,
                            data: status,
                            action: 'status'
                        });
                    }
                });
            });
            res.send(200);
        } else {
            res.send(401);
        }
    });

    app.get('/accounts/:id', function (req, res) {
        if (req.session && req.session.loggedIn) {
            var accountId = req.params.id == 'me'
                ? req.session.accountId
                : req.params.id;
            models.Account.findById(accountId, function (account) {
                if (accountId == 'me' || models.Account.hasContact(account, req.session.accountId)) {
                    account.isFriend = true;
                }
                res.send(account);
            });
        } else {
            res.send(401);
        }
    });
};
var Router = require('ampersand-router');
var app = require('ampersand-app');
var xhr = require('xhr');
var querystring = require('querystring');

var AboutPage = require('./pages/about');
var FitocracyPage = require('./pages/fitocracy');
var HomePage = require('./pages/home');
var Wendler531Model = require('./models/wendler531');
var Wendler531Page = require('./pages/wendler531');

module.exports = Router.extend({
    routes: {
        '': 'home',
        'fitocracy': 'fitocracy',
        '531': 'calc531',
        'about': 'about',
        'auth/callback': 'auth',
        'login': 'login',
        'logout': 'logout'
    },
    home: function () {
        app.activities.reset();
        this.trigger('page', new HomePage());
    },
    fitocracy: function () {
        app.activities.reset();
        this.trigger('page', new FitocracyPage());
    },
    about: function () {
        this.trigger('page', new AboutPage());
    },
    calc531: function () {
        this.trigger('page', new Wendler531Page({
            model: new Wendler531Model()
        }));
    },
    auth: function () {
        var self = this;
        var token = querystring.parse(window.location.search.slice(1)).token;
        if (!token) {
            return this.redirectTo('/');
        }

        xhr({
            url: app.apiUrl + '/validate?token=' + encodeURIComponent(token),
            json: true,
        }, function (err, resp, body) {
            if (!err && resp.statusCode === 200) {
                app.setAccessToken(body.authorization);
            }
            return self.redirectTo('/');
        });
    },
    login: function () {
        window.location.replace(app.accountsUrl + '/login?redirect=lift.zone');
    },
    logout: function () {
        app.setAccessToken(undefined);
        this.redirectTo('/');
    }
});

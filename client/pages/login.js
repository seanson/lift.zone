var View = require('ampersand-view');
var App = require('ampersand-app');

module.exports = View.extend({
    template: require('../templates/pages/login.jade'),
    events: {
        'submit form': 'authenticate'
    },
    render: function () {

        if (App.me.loggedIn) {
            return App.navigate('/');
        }
        this.renderWithTemplate(this);
        return this;
    },
    authenticate: function (e) {

        e.preventDefault();
        App.view.message = '';
        var login = this.query('[name=login]').value;
        var password = this.query('[name=password]').value;
        App.me.authenticate(login, password, {
            success: function (resp) {

                App.setAccessToken(resp.data.attributes.token);
                App.navigate('/');
            },
            error: function (model, resp) {

                App.log(resp);
                App.view.message = 'Invalid login.  Please try again.';
            }
        });
    }
});

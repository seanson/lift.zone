var App = require('ampersand-app');
var View = require('ampersand-view');
var ViewSwitcher = require('ampersand-view-switcher');
var Dom = require('ampersand-dom');
var LocalLinks = require('local-links');

module.exports = View.extend({
    template: require('./templates/body.jade'),
    autoRender: true,
    events: {
        'click a[href]': 'handleLinkClick'
    },
    session: {
        message: 'string'
    },
    bindings: {
        'message': [
            {
                type: 'text',
                hook: 'page-message'
            }, {
                type: 'toggle',
                hook: 'page-message'
            }
        ],
        'model.displayName': {
            type: 'text',
            hook: 'user-name'
        },
        'model.link': {
            type: 'attribute',
            name: 'href',
            hook: 'user-name'
        },
        'model.loggedIn': [
            {
                type: 'booleanClass',
                no: 'button',
                hook: 'user-name'
            }, {
                type: 'toggle',
                hook: 'logout'
            }
        ]
    },
    initialize: function () {

        this.listenTo(App.router, 'page', this.handlePage);
    },
    render: function () {

        this.renderWithTemplate();
        this.pages = new ViewSwitcher(this.queryByHook('page-container'), {
            show: function (view) {

                $(view.el).foundation();
            }
        });
    },
    handlePage: function (pageView) {

        this.message = '';
        App.currentPage = pageView;
        Dom.removeClass(this.query('.top-bar'), 'expanded');
        this.pages.set(pageView);
        //this.setActiveNavItem();
    },
    handleLinkClick: function (e) {


        var localPath = LocalLinks.pathname(e);
        if (localPath) {
            e.preventDefault();
            App.navigate(localPath);
        }
    },
    setActiveNavItem: function () {

        var path = window.location.pathname;

        this.queryAll('[data-hook=navigation] a').forEach(function (aTag) {

            if (aTag.pathname === path) {
                Dom.addClass(aTag.parentNode, 'active');
            } else {
                Dom.removeClass(aTag.parentNode, 'active');
            }
        });
    }
});
'use strict';

var View = require('ampersand-view');

var SuggestionView = require('./suggestion');

var SetView = View.extend({
    template: require('../templates/views/set.pug'),
    bindings: {
        'model.formattedFull': {
            type: 'text',
            hook: 'set'
        }
    }
});

module.exports = View.extend({
    template: require('../templates/views/workout-activity.pug'),
    bindings: {
        'model.displayName': {
            type: 'text',
            hook: 'activity-name'
        },
        'model.comment': [{
            type: 'text',
            hook: 'activity-comment'
        }, {
            type: 'toggle',
            hook: 'activity-comment'
        }],
        'model.ready': {
            type: 'toggle',
            no: '[data-hook=new-activity]'
        },
        'model.hasSuggestions': {
            type: 'toggle',
            hook: 'has-suggestions'
        }
    },
    events: {
        'click [data-hook=new-activity]': 'findAlias'
    },
    render: function () {

        this.renderWithTemplate(this);
        this.renderSubview(new SuggestionView({ model: this.model }), this.queryByHook('new-confirm'));
        this.renderCollection(this.model.sets, SetView, this.queryByHook('sets'));
        this.renderCollection(this.model.suggestions, SuggestionView, this.queryByHook('suggestions'));
        this.cacheElements({ aliasModal: '[data-hook=choose-alias]' });
        $(this.el).foundation();
        return this;
    },
    findAlias: function () {

        $(this.aliasModal).foundation('reveal', 'open');
    },
    closeModal: function () {

        $(this.aliasModal).foundation('reveal', 'close');
    }
});

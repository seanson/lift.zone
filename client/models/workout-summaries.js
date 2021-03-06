'use strict';

var App = require('ampersand-app');
var Collection = require('ampersand-rest-collection');
var State = require('ampersand-state');
var ApiMixin = require('./mixins/api-collection');

var WorkoutSummary = State.extend({
    idAttribute: 'date',
    props: {
        id: 'string',
        name: 'string',
        date: 'string',
        activities: 'number'
    },
    derived: {
        activityLabel: {
            deps: ['activities'],
            fn: function () {

                if (this.activities === 1) {
                    return '1 activity';
                }
                return String(this.activities) + ' activities';
            }
        },
        link: {
            deps: ['date'],
            fn: function () {

                return '/workouts/' + this.date;
            }
        },
        datetime: {
            deps: ['date'],
            fn: function () {

                return new Date(this.date);
            }
        }
    }
});

var WorkoutSummaryCollection = Collection.extend(ApiMixin, {
    comparator: 'date',
    url: function () {

        return App.apiUrl + '/workouts';
    },
    fetched: false,
    model: WorkoutSummary
});

module.exports = WorkoutSummaryCollection;

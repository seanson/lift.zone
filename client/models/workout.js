'use strict';

var App = require('ampersand-app');
var Model = require('ampersand-model');
var ApiMixin = require('./mixins/api-model');
var Activities = require('./workout-activities');
var Moment = require('moment');

var dateId = function (date) {

    return Moment(date).format('YYYY-MM-DD');
};

module.exports = Model.extend(ApiMixin, {
    urlRoot: function () {

        return App.apiUrl + '/workouts';
    },
    props: {
        id: 'string',
        name: ['string', true, 'My Workout'],
        date: ['date', true, function () {

            return new Date();
        }],
        raw: 'string'
    },
    session: {
        exists: 'boolean'
    },
    collections: {
        activities: Activities
    },
    parse: function (resp) {

        if (resp && resp.date) {
            resp.date = Moment(resp.date, 'YYYY-MM-DD');
        }
        return resp;
    },
    serialize: function () {

        var res = Model.prototype.serialize.apply(this, arguments);
        res.date = this.dateId;
        return res;
    },
    derived: {
        editLink: {
            deps: ['dateId'],
            fn: function () {

                return '/workouts/' + this.dateId + '/edit';
            }
        },
        formattedDate: {
            deps: ['date'],
            fn: function () {

                return Moment(this.date).format(App.me.preferences.dateFormat);
            }
        },
        dateId: {
            deps: ['date'],
            fn: function () {

                return dateId(this.date);
            }
        }
    }
});

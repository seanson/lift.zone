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
        raw_date: 'string',
        user_name: 'string',
        visible: 'boolean',
        raw: 'string'
    },
    session: {
        exists: 'boolean',
        lastInGroup: 'boolean' //used for sharing styles
    },
    collections: {
        activities: Activities,
        pendingActivity: Activities
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
    fetchPublic: function (opts) {

        opts.url = App.apiUrl + '/public/workouts/' + this.id;
        this.fetch(opts);
    },
    derived: {
        canShare: {
            deps: ['visible'],
            fn: function () {

                if (this.visible === null && App.me.preferences) {
                    return App.me.preferences.visible;
                }
                return this.visible;
            }
        },
        shareLink: {
            deps: ['id'],
            fn: function () {

                return App.portalUrl + '/public/workouts/' + this.id;
            }
        },
        editLink: {
            deps: ['dateId'],
            fn: function () {

                return '/workouts/' + this.dateId + '/edit';
            }
        },
        formattedDate: {
            deps: ['date'],
            fn: function () {

                if (App.me.preferences) {
                    return Moment(this.date).format(App.me.preferences.dateFormat);
                }
                //TODO add user_date_format for public workouts
                return Moment(this.date).format('dddd, MMM Do YYYY');
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

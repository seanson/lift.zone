'use strict';

var Caber = require('caber');
var Debounce = require('lodash.debounce');
var Moment = require('moment');
var App = require('ampersand-app');

var View = require('ampersand-view');
var ActivityView = require('../views/workout-activity-short');

var dateFormats = [
    'MM/DD/YYYY',
    'YYYY/MM/DD',
    'MM-DD-YYYY',
    'YYYY-MM-DD',
    'dddd'
];

module.exports = View.extend({
    template: require('../templates/pages/new-workout.pug'),
    initialize: function (options) {

        if (options.date) {
            this.template = require('../templates/pages/edit-workout.pug');
            this.date = options.date;
            var workoutSummary = App.workoutSummaries.get(options.date);
            if (!workoutSummary) {
                this.template = require('../templates/pages/not-found.pug');
            }
            else {
                this.model.id = workoutSummary.id;
                this.model.date = workoutSummary.date + ' 00:00';
                this.model.fetch();
            }
        }
        this.throttledParse = Debounce(this.userInputChanged, 1000);
        this.listenTo(this.model, 'change:date', this.checkExisting);
        this.listenToOnce(App.workoutSummaries, 'reset', this.checkExisting);
    },
    events: {
        'input [data-hook=workout-input]': 'throttledParse',
        'input [data-hook=name-input]': 'setName',
        'input [data-hook=date-input]': 'setDate',
        'submit form': 'addSingleActivity'
    },
    session: {
        'working': 'boolean',
        'save': ['string', true, 'Save']
    },
    checkExisting: function (model, newDate, ctx) {

        if (!ctx || !ctx.xhr) {
            var date =  Moment(newDate).format('YYYY-MM-DD');
            var exists = App.workoutSummaries.get(date);
            if (!this.model.id && exists) {
                return $(this.queryByHook('workout-exists')).foundation('reveal', 'open');
            }
            if (this.model.id && (date !== this.date) && exists) {
                return $(this.queryByHook('workout-exists')).foundation('reveal', 'open');
            }
        }
    },
    bindings: {
        save: {
            type: 'attribute',
            name: 'value',
            hook: 'save-workout'
        },
        working: {
            type: 'booleanClass',
            hook: 'save-workout',
            name: 'disabled'
        },
        'model.raw': {
            type: 'text',
            hook: 'workout-input'
        },
        'model.name': {
            type: 'text',
            hook: 'workout-name'
        },
        'model.formattedDate': {
            type: 'text',
            hook: 'workout-date'
        }
    },
    derived: {
        smartLabel: {
            deps: ['smartMode'],
            fn: function () {

                if (this.smartMode) {
                    return 'on';
                }
                return 'off';
            }
        }
    },
    render: function () {

        this.renderWithTemplate();
        this.renderCollection(this.model.pendingActivity, ActivityView, this.queryByHook('workout-pendingactivity'));
        this.renderCollection(this.model.activities, ActivityView, this.queryByHook('workout-activities'));
        this.checkExisting(this.model, this.model.dateId);
        $('#rawInput').focus();
        return this;
    },
    setName: function (e) {

        var name = e.target.value;
        if (name === '') {
            this.model.unset('name');
        }
        else {
            this.model.name = e.target.value;
        }
    },
    setDate: function (e) {

        var date = e.target.value;
        if (date === '') {
            this.model.unset('date');
        }
        else if (this.model.dateId !== Moment(e.target.value, dateFormats).format('YYYY-MM-DD')) {
            this.model.date = Moment(e.target.value, dateFormats);
        }
    },
    userInputChanged: function (e) {

        if (!e.target.value) {
            return;
        }
        $.ajax({
            url: App.apiUrl + '/suggest/activities/' + e.target.value,
            headers: { 'authorization': 'Bearer ' + App.accessToken }
        }).then((data) => {

            this.model.activitySuggestList  = data.suggestions.map((item) => item.name );
        });
        this.parseWorkout(e.target);
    },
    addActivities: function (activities) {

        //TODO figure out how to make this not bump name changes to the bottom of the pile
        var activityNames = [];
        //We need to do a janky merge by alternate index so that our search() functions only have to run once
        //find things to add
        activities.forEach(function (activity, i) {

            activityNames.push(activity.name);
            if (!this.model.activities.get(activity.name, 'name')) {
                this.model.activities.add(activity, { fetch: true, at: i });
            }
            else {
                this.model.activities.get(activity.name, 'name').set({ comment: undefined });
                this.model.activities.get(activity.name, 'name').set(activity);
            }
        }, this);
        //find things to remove
        this.model.activities.forEach(function (activity) {

            if (activityNames.indexOf(activity.name) === -1) {
                this.model.activities.remove(activity);
            }
        }, this);
    },
    parseWorkout: function (el) {

        var data = el.value;
        this.model.pendingActivity.forEach(function (activity, i) {

            this.model.pendingActivity.remove(activity);
        }, this);
        var workout = Caber.workout(data, App.me.preferences.weightUnit);
        if (workout.name) {
            this.model.name = workout.name;
        }
        if (workout.date) {
            if (workout.rawDate !== this.model.raw_date) {
                this.model.date = workout.date;
            }
            this.model.raw_date = workout.rawDate;
        }
        this.model.pendingActivity.add(workout.activities[0], { fetch: true });
    },
    addSingleActivity: function (e) {

        e.preventDefault();
        this.model.pendingActivity.forEach(function (activity, i) {

            this.model.activities.add(activity);
        }, this);
        $(this.render());
    },
    saveWorkout: function (e) {

        e.preventDefault();
        var self = this;
        App.view.message = '';
        var ready = self.model.activities.every(function (activity) {

            return activity.ready;
        });
        if (this.model.activities.length === 0) {
            return $(self.queryByHook('workout-empty')).foundation('reveal', 'open');
        }
        if (!ready) {
            return $(self.queryByHook('new-activities')).foundation('reveal', 'open');
        }
        self.save = 'Saving…';
        self.working = true;
        self.model.save(null, {
            success: function (saved) {

                if (self.date) {
                    App.workoutSummaries.remove({ date: self.date });
                }
                App.workoutSummaries.add({ id: saved.id, date: saved.dateId, name: saved.name, activities: saved.activities.length });
                App.navigate('/workouts/' + saved.dateId);
            },
            error: function (model, newModel, ctx) {

                App.view.message = 'Unknown error saving workout.';
                self.working = false;
                self.save = 'Save';
                if (ctx.xhr.status === 409) {
                    return $(self.queryByHook('workout-exists')).foundation('reveal', 'open');
                }
            }
        });
    }
});

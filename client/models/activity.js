var Model = require('ampersand-state');
var Sets = require('./sets');

//[i]Comments[/i] Comments here after list
module.exports = Model.extend({
    props: {
        name: 'string',
        comment: 'string'
    },
    idAttribute: 'name',
    collections: {
        sets: Sets
    },
    derived: {
        hasComment: {
            fn: function () {
                if (this.comment) {
                    return true;
                }
                return false;
            }
        }
    }
});

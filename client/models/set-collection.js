'use strict';

var Collection = require('ampersand-collection');

module.exports = Collection.extend({
    model: require('./set')
});


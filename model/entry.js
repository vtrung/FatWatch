

var mongoose = require('mongoose');
var config = require('../config.js');

mongoose.Promise = global.Promise;
mongoose.connect(config.mongoConnectionString);
var Schema = mongoose.Schema;

var entrySchema = new Schema({
    weight: Number,
    datetime: Date,
})

var Entry = mongoose.model('Entry', entrySchema);

module.exports = Entry;
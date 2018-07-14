var mongoose = require('mongoose');
var config = require('../config.js');

mongoose.Promise = global.Promise;
mongoose.connect(config.mongoConnectionString, { useNewUrlParser: true });
var Schema = mongoose.Schema;

var entrySchema = new Schema({
    userid: {type: mongoose.Schema.Types.ObjectId, ref:"userSchema"},
    weight: Number,
    datetime: Date,
})

var Entry = mongoose.model('Entry', entrySchema);

module.exports = Entry;
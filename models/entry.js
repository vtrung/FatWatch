var mongoose = require('mongoose');
var config = require('../config.js');

mongoose.Promise = global.Promise;
mongoose.connect(config.mongoConnectionString, { useNewUrlParser: true });
var Schema = mongoose.Schema;

var entrySchema = new Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref:"user", required: true},
    weight: {type:Number, required: true},
    datetime: {type:Date, required: true},
})

var Entry = mongoose.model('entry', entrySchema);

module.exports = Entry;
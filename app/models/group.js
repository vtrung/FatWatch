var mongoose = require('mongoose');
var config = require('../config.js');

mongoose.Promise = global.Promise;
mongoose.connect(config.mongoConnectionString, { useNewUrlParser: true });
var Schema = mongoose.Schema;

var groupSchema = new Schema({
    groupname: { type : String , unique : true, required : true},
    creator: {type: mongoose.Schema.Types.ObjectId, ref:"user", required: true}
})

var Group = mongoose.model('group', groupSchema);

module.exports = Group;
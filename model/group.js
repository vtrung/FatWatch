var mongoose = require('mongoose');
var config = require('../config.js');

mongoose.Promise = global.Promise;
mongoose.connect(config.mongoConnectionString, { useNewUrlParser: true });
var Schema = mongoose.Schema;

var groupSchema = new Schema({
    groupid: { type : String , unique : true, required : true},
    userid: { type : String , required : true}
})

var Group = mongoose.model('Group', groupSchema);

module.exports = Group;
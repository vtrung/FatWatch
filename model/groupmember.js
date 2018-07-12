var mongoose = require('mongoose');
var config = require('../config.js');

mongoose.Promise = global.Promise;
mongoose.connect(config.mongoConnectionString, { useNewUrlParser: true });
var Schema = mongoose.Schema;

var groupMemberSchema = new Schema({
    groupid: String,
    userid: String
})

groupSchema.index({ groupid: 1, userid: 1 }, { unique: true })

var GroupMember = mongoose.model('GroupMember', groupMemberSchema);

module.exports = GroupMember;
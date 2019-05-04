var mongoose = require('mongoose');
var config = require('../config.js');

mongoose.Promise = global.Promise;
mongoose.connect(config.mongoConnectionString, { useNewUrlParser: true });
var Schema = mongoose.Schema;

var groupMemberSchema = new Schema({
    group: {type: mongoose.Schema.Types.ObjectId, ref:"group", required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref:"user", required: true}
})

groupMemberSchema.index({ group: 1, user: 1 }, { unique: true })

var GroupMember = mongoose.model('groupmember', groupMemberSchema);

module.exports = GroupMember;
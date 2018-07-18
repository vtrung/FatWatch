var mongoose = require('mongoose');
var config = require('../config.js');

mongoose.Promise = global.Promise;
mongoose.connect(config.mongoConnectionString, { useNewUrlParser: true });
var Schema = mongoose.Schema;

var groupSchema = new Schema({
    groupname: { type : String , unique : true, required : true},
    creater: {type: mongoose.Schema.Types.ObjectId, ref:"userScheme", required: true}
})

var Group = mongoose.model('Group', groupSchema);

module.exports = Group;
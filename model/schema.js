// var mongoose = require('mongoose');
// var config = require('../config.js');

// mongoose.Promise = global.Promise;
// mongoose.connect(config.mongoConnectionString, { useNewUrlParser: true });
// var Schema = mongoose.Schema;

// var userSchema = new Schema({
//     username: { type : String , unique : true, required : true},
//     password: String
// })

// var User = mongoose.model('User', userSchema);

// var entrySchema = new Schema({
//     user: {type: mongoose.Schema.Types.ObjectId, ref:"userSchema"},
//     weight: Number,
//     datetime: Date,
// })

// var Entry = mongoose.model('Entry', entrySchema);



// var groupSchema = new Schema({
//     groupname: { type : String , unique : true, required : true},
//     creator: {type: mongoose.Schema.Types.ObjectId, ref:"userScheme"}
// })

// var Group = mongoose.model('Group', groupSchema);

// var groupMemberSchema = new Schema({
//     group: {type: mongoose.Schema.Types.ObjectId, ref:"groupScheme"},
//     user: {type: mongoose.Schema.Types.ObjectId, ref:"userScheme"}
// })

// groupMemberSchema.index({ group: 1, user: 1 }, { unique: true });

// var GroupMember = mongoose.model('GroupMember', groupMemberSchema);

// module.exports = Entry;
// module.exports = Group;
// module.exports = GroupMember;
// module.exports = User;
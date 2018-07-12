var mongoose = require('mongoose');
var config = require('../config.js');

mongoose.Promise = global.Promise;
mongoose.connect(config.mongoConnectionString, { useNewUrlParser: true });
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: { type : String , unique : true, required : true},
    password: String
})

var User = mongoose.model('User', userSchema);

module.exports = User;
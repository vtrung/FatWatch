var mongoose = require('mongoose');
var config = require('../config.js');

mongoose.Promise = global.Promise;
mongoose.connect(config.mongoConnectionString, { useNewUrlParser: true });
var Schema = mongoose.Schema;

var passwordSchema = new Schema({
    password: { type : String , required : true},
    salt: {type: String, required: true},
    user: { type: mongoose.Schema.Types.ObjectId, ref:"user", required: true}
})

var Password = mongoose.model('password', passwordSchema);

module.exports = Password;
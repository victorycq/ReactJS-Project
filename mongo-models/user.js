const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({

    username:String,
    password:String,
    email:String,
    fullName: String
});

module.exports = mongoose.model('users', userSchema);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
});


userSchema.plugin(passportLocalMongoose);   //hashing Algo pbkdf2   // auto add username , password in schema

module.exports  = mongoose.model('User', userSchema);
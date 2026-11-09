const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;

// console.log(typeof passportLocalMongoose);
// console.log(typeof passportLocalMongoose.default);

const  userSchema = new Schema({
    email:{
        type:String,
        required:true
    }
});

userSchema.plugin(passportLocalMongoose);  //. Passport-Local Mongoose will add a username, hash and salt field to store the username, the hashed password and the salt value.

module.exports = mongoose.model('User', userSchema);
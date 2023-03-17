const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');
    
const Email = new Schema({
	
		address: {type: String, lowercase: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true},
		// Change the default to true if you don't need to validate a new user's email address
		validated: {type: Boolean, default: false}
	
	});

const UserSchema = new Schema({
        email: {type: Email, required: true},
		password: { type: String, required: true },	
	},);

UserSchema.plugin(uniqueValidator, {message: 'is already taken.'});

UserSchema.pre("save", function(next) {
    if(!this.isModified("password")) {
 	   return next();
    }
    this.password = bcrypt.hashSync(this.password, 10);
    next();
});

UserSchema.methods.comparePassword = function(plaintext) {
    return (bcrypt.compareSync(plaintext, this.password));
};

module.exports = mongoose.model("User", UserSchema);
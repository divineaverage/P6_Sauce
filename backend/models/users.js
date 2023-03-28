import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import bcrypt from 'bcrypt';

const Schema = mongoose.Schema;
    
export const Email = new Schema({
	
		address: {type: String, lowercase: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true},
		// Change the default to true if you don't need to validate a new user's email address
		validated: {type: Boolean, default: false}
	
	});

export const UserSchema = new Schema({
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

export const User = mongoose.model('User', UserSchema);
export default User
// grab the mongoose module
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');



var UserSchema = new Schema({
	firstName : String,
        lastName : String,
	email : String,
        username : String,
        password : {type : String, default: ''}
});

UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

var ShiftAssignment = new Schema({
	"userId": Number,
	"time": Date,
	"role" : String,
	"userName" : String
});

var Staff = new Schema({
	id : Number,
	first_name : {type : String, default: ''},
	last_name : {type : String, default: ''},
	email : {type : String, default: ''},
	phone_number : {type : String, default: ''},
	notes : {type : String, default: ''}
});




module.exports = {
    User : mongoose.model('User', UserSchema),
    Staff : mongoose.model('Staff', Staff),
    ShiftAssignment : mongoose.model('ShiftAssignment', ShiftAssignment)
}

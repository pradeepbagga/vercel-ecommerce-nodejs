const mongoose = require('mongoose');
const { Schema } = mongoose;
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, "Please enter an email"],
        unique: true,
        validate: [validator.isEmail, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, "Please enter password"],
        minlength: [6, "Password minimum length is 6"],
        maxlength: [15, "Password maxlength length is 15"],
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true, "Please confirm your password"],
        minlength: [6, "Password minimum length is 6"],
        maxlength: [15, "Password maxlength length is 15"],
        validate: {
            validator: function(val){
                return val == this.password
            },
            message: "Password & Confirm Password does not match"
        }
    },
    passwordChangedAt: Date,
    role: {
        type: String,
        required: true,
        default: 'user'
    },
    name: {
        type: String,
        required: [true, "Please enter your name"]
    },
});

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
    next();
});

userSchema.methods.comparePassword = async function(pwd, pwdDB) {
    return await bcrypt.compare(pwd, pwdDB);
}

userSchema.methods.isPasswordChange = async function(jwtTimeStamp){
    if(this.passwordChangedAt) {
        const passwordChangedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        console.log(passwordChangedTimeStamp, jwtTimeStamp);
        return jwtTimeStamp < passwordChangedTimeStamp;
    }
    return false;
}

userSchema.virtual('id').get(function(){
    return this._id
});
userSchema.set('toJSON', {
    virtuals:true,
    versionKey: false,
    transform: function(doc,ret) {
        delete ret._id
    }
});

exports.User = mongoose.model("User",userSchema);
const { User } = require('../models/User');
const asyncErrorHandler = require('../utils/asyncErrorHandler');
const CustomError = require('../utils/CustomError');
const jwt = require('jsonwebtoken');
const util = require('util');

const signToken = (id) => {
    return jwt.sign({ id: id },
        process.env.SESSION_SECRET, {
        expiresIn: 60 * 60
    });
}

exports.createUser = asyncErrorHandler(async (req, res) => {
    const user = new User(req.body);
    const newUser = await user.save();
    console.log('doc - ', newUser)
    const token = signToken(newUser._id);
    res.status(201).json({
        status: "success",
        token
    });
});

exports.login = asyncErrorHandler(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        const error = new CustomError("Please provide an email ID & Password", 400);
        return next(error);
    }

    const user = await User.findOne({ email }).select("+password");
    console.log('user - ', user);

    // const isMatch = await user.comparePassword(password, user.password);
    // console.log('isMatch - ', isMatch);

    if (!user || !(await user.comparePassword(password, user.password))) {
        const error = new CustomError("Incorrect email or password", 400);
        return next(error);
    }

    const token = signToken(user._id);

    return res.status(200).json({
        status: "success",
        token
    });
});

exports.protect = asyncErrorHandler(async (req,res,next) => {    
    const {authorization} = req.headers;
    if(!authorization) {
        const err = new CustomError("You are not logged in!",401);
        return next(err);
    }
    let token;
    if(authorization && (authorization.startsWith('Bearer') || authorization.startsWith('bearer'))) {
        token = authorization.split(" ")[1];
    }

    // 2. Validate the token
    const decodedToken = await util.promisify(jwt.verify)(token, process.env.SESSION_SECRET);
    console.log("tokenVerify - ", decodedToken);

    // 3. If the user exists
    const user = await User.findById(decodedToken.id);
    console.log("user - ", user);
    if(!user) {
        const err = new CustomError("The user with the given token does not exit",401);
        next(err);
    }
    
    // 4. If the user changed password after the token was issued
    if(await user.isPasswordChange(decodedToken.iat)) {
        const err = new CustomError("The password has been changed recently. Please login again.", 401);
        return next(err);
    }

    // 5. Allow user to acess route
    console.log("USER - ", user);
    next();

});
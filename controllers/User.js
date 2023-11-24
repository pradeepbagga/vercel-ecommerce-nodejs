const { User } = require('../models/User');
const asyncErrorHandler = require('../utils/asyncErrorHandler');
const CustomError = require('../utils/CustomError');
const jwt = require('jsonwebtoken');
const util = require('util');
// const { EmailVerifyToken } = require('../models/Token');

const signToken = (id) => {
    return jwt.sign({ id: id },
        process.env.SESSION_SECRET, {
        expiresIn: 60 * 60
    });
}

const emailVerification = require("../utils/emailVerification");

exports.createUser = asyncErrorHandler(async (req, res) => {
    const user = new User(req.body);
    const newUser = await user.save();
    // console.log('doc - ', newUser);
    const token = signToken(newUser._id);

    await emailVerification(token, newUser.email);
    // console.log('emailSend - ', emailSend);

    return res.status(201).json({
        success: true,
        message: 'Please check your email and please verify. Token is valid for 1 hour.'
    });
});

exports.login = asyncErrorHandler(async (req, res, next) => {
    const { email, password } = req.body;
    // console.log('email - ', email);
    // console.log('password - ', password);
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
        console.log('error - ', error);
        return next(error);
    }

    const token = signToken(user._id);
    // console.log('token - ', token);

    return res.cookie(
        'myAppToken', token
    ).status(200).json({
        success: true,
        token
    });
});

exports.logout = asyncErrorHandler(async(req,res,next) => {
    // res.cookie("jwt",undefined);
    console.log('logout')
    res.clearCookie("jwt");
    return res.status(200).json({
        success:true
    })
});

exports.protect = asyncErrorHandler(async (req, res, next) => {
    console.log('protect - ', req.headers);
    // const { myAppToken } = req.cookies;
    const { authorization } = req.headers;
    console.log('authorization - ', authorization);
    // console.log('myAppToken - ', myAppToken);

    // if (!myAppToken || myAppToken === undefined) {
    //     const err = new CustomError("You are not logged in!", 401);
    //     return next(err);
    // }
    
    if (!authorization) {
        const err = new CustomError("You are not logged in!", 401);
        return next(err);
    }

    let auth = authorization.split(" ");
    console.log('auth - ', auth)
    
    let token;
    token = auth[1].trim();
    console.log(token);
    // if (authorization && (authorization.startsWith('Bearer') || authorization.startsWith('bearer'))) {
    //     token = authorization.split(" ")[1];
    // }

    // 2. Validate the token 
    // const decodedToken = await util.promisify(jwt.verify)(token, process.env.SESSION_SECRET);
    const decodedToken = jwt.verify(token, process.env.SESSION_SECRET);
    console.log("tokenVerify - ", decodedToken);

    // 3. If the user exists
    const user = await User.findById(decodedToken.id);
    console.log("user protect 1 - ", user);
    if (!user) {
        const err = new CustomError("The user with the given token does not exit", 401);
        next(err);
    }

    // 4. If the user changed password after the token was issued
    if (await user.isPasswordChange(decodedToken.iat)) {
        const err = new CustomError("The password has been changed recently. Please login again.", 401);
        return next(err);
    }

    // 5. Allow user to acess route
    console.log("USER protect 2 - ", user);
    next();
});

exports.emailVerify = asyncErrorHandler(async (req, res, next) => {
    console.log('emailVerify - ', req.params);
    const { token } = req.params;
    console.log('token - ', token);
    const tokenVerify = jwt.verify(token, process.env.SESSION_SECRET);
    console.log('tokenVerify - ', tokenVerify);
    if (tokenVerify) {
        const user = await User.findByIdAndUpdate(tokenVerify.id, {
            verified: true
        }, {new: true});

        console.log('USER UPDATED - ', user);

        return res.status(200).json({
            success: true,
            message: 'Your email is verified.'
        });
    }
    else {
        return res.status(401).json({
            success: false,
            message: 'Token is expired.'
        });
    }
});

exports.profile = asyncErrorHandler(async (req, res, next) => {
    // const token = req.cookies.myAppToken;
    const { authorization } = req.headers;
    console.log("Profile page authorization - ", authorization);
    let token = authorization.split(" ");
    token = token[1].trim();
    console.log("token-",token);
    const {id} = jwt.verify(token, process.env.SESSION_SECRET);
    console.log('decode - ', id);
    const user = await User.findById(id);
    console.log('user - ', user);
    user._id = undefined;
    user.verified = undefined;
    user.__v = undefined;
    return res.status(200).json({
        success: true,
        user: user
    })
});
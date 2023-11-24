const nodemailer = require("nodemailer");
const crypto = require('crypto');
// const {EmailVerifyToken} = require('../models/Token');

// module.exports = async (id,email) => {
module.exports = async (token,email) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: "pradeepb.ecommerce@gmail.com",
            pass: "fszxywpirbujblvn",
        },
    });

    // const token = crypto.randomBytes(50).toString("hex");
    // const url = `${process.env.FRONTEND_URL}/${id}/verify/${token}`;
    // const a = new EmailVerifyToken({userId:id, token:token});
    // const b = await a.save();
    // console.log('b - ', b)
    const url = `${process.env.FRONTEND_URL}/verify/${token}`;
    const emailText = `<p>To verify your email please <a href="${url}">click</a> here</p>`;

    return await transporter.sendMail({
        from: "pradeepb.ecommerce@gmail.com",
        to: email,
        subject: 'Please verify your email',
        html: emailText
    });
}
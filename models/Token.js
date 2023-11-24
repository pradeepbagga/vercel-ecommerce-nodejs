const mongoose = require('mongoose');
const { Schema } = mongoose;

const tokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'user',
        unique: true
    },
    token: {
        type: String,
        required: true
    },
    expiresAfter: { 
        type: Date, 
        default: Date.now(),
        expires: 7200
    }
});
// tokenSchema.index({createdAt: 1},{expireAfterSeconds: 100})

exports.EmailVerifyToken = mongoose.model('EmailVerifyToken', tokenSchema);
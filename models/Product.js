const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: [1, "wrong minimum price"],
        max: [100000, "wrong maximum price"]
    },
    discountPercentage: {
        type: Number,
        min: [0, "wrong minimum discount"],
        max: [99, "wrong maximum discount"]
    },
    rating: {
        type: Number,
        min: [1, "wrong minimum rating"],
        max: [5, "wrong maximum rating"]
    },
    stock: {
        type: Number,
        min: [0, "wrong minimum stock"],
        default: 0
    },
    brand: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    images: {
        type: [String],
        required: true
    },
    deleted: {
        type: Boolean,
        default: false
    }
});

const virtual = productSchema.virtual('id');
virtual.get(function(){
    return this._id;
});
productSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function(doc,ret) { delete ret._id }
})

exports.Product = mongoose.model('Product',productSchema);
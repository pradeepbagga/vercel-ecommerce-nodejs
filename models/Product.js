const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
    title: {
        type: String,
        required: [true, "Product title is required"],
        unique: true
    },
    description: {
        type: String,
        required: [true, "Product description is required"],
    },
    price: {
        type: Number,
        required: [true, "Product price is required"],
        min: [1, "minimum price is 1"],
        max: [100000, "maximum price is 100000"]
    },
    discountPercentage: {
        type: Number,
        min: [0, "minimum discount is 0"],
        max: [99, "maximum discount is 99"]
    },
    rating: {
        type: Number,
        min: [1, "minimum rating is 1"],
        max: [5, "maximum rating is 5"],
        default:0
    },
    stock: {
        type: Number,
        min: [0, "wrong minimum stock"],
        default: 0
    },
    brand: {
        type: String,
        required: [true, "Brand is required"],
    },
    category: {
        type: String,
        required: [true, "Category is required"],
    },
    thumbnail: {
        type: String,
        required: [true, "Thumbnail is required"],
    },
    images: {
        type: [String],
        required: [true, "Minimum one image is required"],
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
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
        required: [true, "Images are required"],
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
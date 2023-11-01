const { Product } = require('../models/Product');
const asyncErrorHandler = require('../utils/asyncErrorHandler');
const CustomError = require('../utils/CustomError');

exports.createProduct = asyncErrorHandler(async (req, res) => {
    const product = new Product(req.body);
    // console.log('REQ BODY - ', req.body)
    // try {
    const doc = await product.save();
    res.status(201).json(doc);
    // } catch (error) {
    //     console.log('Error createProduct - ', error)
    //     res.status(400).json(error);
    // }
});

exports.fetchAllProducts = asyncErrorHandler(async (req, res) => {
    console.log('QUERY - ', req.query);

    let query = Product.find({});
    let totalProducts = Product.find({});

    if (req.query.category) {
        query = query.find({ category: { $in: req.query.category.split(",") } })
        totalProducts = totalProducts.find({ category: { $in: req.query.category.split(",") } })
    }
    if (req.query.brand) {
        query = query.find({ brand: { $in: req.query.brand.split(",") } })
        totalProducts = totalProducts.find({ brand: { $in: req.query.brand.split(",") } })
    }

    if (req.query._sort && req.query._order) {
        query = query.sort({ [req.query._sort]: req.query._order });
        totalProducts = totalProducts.sort({ [req.query._sort]: req.query._order });
    }

    if (req.query._page && req.query._limit) {
        let pageSize = req.query._limit;
        const page = req.query._page;
        query = query.skip(pageSize * (page - 1)).limit(pageSize);
    }

    try {
        const docs = await query.exec();
        const totalDocs = await totalProducts.count().exec();
        // console.log('totalDocs - ', totalDocs);
        // console.log('ALL PRODUCTS SUCCESS - ', docs);
        res.status(200).json({
            totalCount: totalDocs,
            products: docs
        });
    } catch (error) {
        console.log('ALL PRODUCTS ERROR - ', error)
        res.status(400).json(error)
    }

});

exports.fetchProductById = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;

    const product = await Product.findById(id);
    // console.log('product - ', product);

    if (product == null) {
        const err = new CustomError('Product is not found with this ID!', 404);
        return next(err);
    }

    return res.status(200).json(product)
});

exports.updateProduct = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    let product;
    try {
        product = await Product.findById(id);
    } catch (error) {
        const err = new CustomError('Product is not found with this ID!', 404);
        return next(err);
    }
    product = await Product.findByIdAndUpdate(id, req.body,
        {
            new: true,
            runValidators: true
        });
    res.status(200).json(product);
});
const { Product } = require('../models/Product');

exports.createProduct = async (req, res) => {
    const product = new Product(req.body);
    // console.log('REQ BODY - ', req.body)
    try {
        const doc = await product.save();
        res.status(201).json(doc);
    } catch (error) {
        console.log('Error createProduct - ', error)
        res.status(400).json(error);
    }
}

exports.fetchAllProducts = async (req,res) => {
    console.log('QUERY - ', req.query);
    
    let query = Product.find({});
    let totalProducts = Product.find({});

    if(req.query.category) {
        query = query.find({ category: {$in: req.query.category.split(",")} })
        totalProducts = totalProducts.find({ category: {$in: req.query.category.split(",")} })
    }

    if(req.query._sort && req.query._order) {
        query = query.sort({ [req.query._sort] : req.query._order });
        totalProducts = totalProducts.sort({ [req.query._sort] : req.query._order });
    }

    if(req.query._page && req.query._limit) {
        let pageSize = req.query._limit;
        const page = req.query._page;
        query = query.skip(pageSize * (page - 1)).limit(pageSize);
    }
        
    try {
        const docs = await query.exec();
        const totalDocs = await totalProducts.count().exec();
        console.log('totalDocs - ', totalDocs);
        console.log('ALL PRODUCTS SUCCESS - ', docs);
        res.status(201).json({
            totalCount: totalDocs,
            products: docs
        });
    } catch (error) {
        console.log('ALL PRODUCTS ERROR - ', error)
        res.status(400).json(error)
    }

}
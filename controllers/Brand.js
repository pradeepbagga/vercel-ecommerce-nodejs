const { Brand } = require('../models/Brand');
const asyncErrorHandler = require('../utils/asyncErrorHandler');

exports.fetchBrands = async (req,res) => {
    try {
        const brands = await Brand.find({}).exec();
        return res.status(201).json(brands);
    } catch (error) {
        return res.status(400).json(error);
    }
}

exports.createBrands = asyncErrorHandler(async (req, res, next) => {
    const brand = new Brand(req.body);
    try {
        const doc = await brand.save();
        return res.status(201).json(doc);
    } catch (error) {
        return res.status(400).json(error);
    }
})
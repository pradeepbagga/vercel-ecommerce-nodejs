const { Category } = require('../models/Brand');

exports.fetchCategory = async (req,res) => {
    try {
        const category = await Category.find({}).exec();
        return res.status(201).json(category);
    } catch (error) {
        return res.status(400).json(error);
    }
}

exports.createCategory = async (req,res) => {
    const category = new Category(req.body);
    try {
        const doc = await category.save();
        return res.status(201).json(doc);
    } catch (error) {
        return res.status(400).json(error);
    }
}
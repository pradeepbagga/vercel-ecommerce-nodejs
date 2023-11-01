const { Category } = require('../models/Category');

exports.createCategory = async (req, res) => {
    const category = new Category(req.body);
    // console.log('REQ BODY - ', req.body)
    try {
        const doc = await category.save();
        res.status(201).json(doc);
    } catch (error) {
        console.log('Error create Category - ', error)
        res.status(400).json(error);
    }
}
exports.fetchCategory = async (req,res) => {
    try {
        const category = await Category.find({}).exec();
        return res.status(201).json(category);
    } catch (error) {
        return res.status(400).json(error);
    }
}
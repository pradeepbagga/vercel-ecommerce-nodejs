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
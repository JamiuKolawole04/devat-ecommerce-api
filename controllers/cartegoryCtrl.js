const Category = require('../models/categoryModel')

// GET CATEGORIES
const getCategories = async (req, res) => {
    try {
        const category = await Category.find()
        res.json({ category });
    } catch (error) {
        res.status(500).json({ msg: err.message });

    }

}


// CREATE CATEGORIES
const createCategory = async (req, res, next) => {
    try {
        // if user have role = 1 ----> admin
        // only admin can create, delete and update category
        const { name } = req.body;
        const category = await Category.findOne({ name });
        if (category) return res.status(400).json({ msg: 'This category already exists' });

        const newCategory = new Category({ name });

        await newCategory.save();
        res.status(200).json({ msg: 'Created a category' })
    } catch (err) {
        res.status(500).json({ msg: err.message })
    }
}

// DELETE CATEGORY
const deleteCategory = async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Deleted a category' });
    } catch (error) {
        res.status(500).json({ msg: err.message });
    }

}

// UPDATE A CATEGORY
const updateCategory = async (req, res) => {
    try {
        const { name } = req.body;
        await Category.findOneAndUpdate({ _id: req.params.id }, { name });
        res.status(200).json({ msg: "Updated a category" })

    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}

module.exports = {
    getCategories,
    createCategory,
    deleteCategory,
    updateCategory
}
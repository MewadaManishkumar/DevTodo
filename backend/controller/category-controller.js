const Category = require('../model/Category');
const Task = require('../model/Task')

const getCategory = async (req, res) => {
    try {
        const categories = await Category.find({ userId: req.params.userId });
        res.send(categories);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
}

const getSelectCategory = async (req, res) => {
    try {
        const selectedCategory = await Category.findById(req.params._id);
        res.send(selectedCategory);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
}

const createCategory = async (req, res) => {
    const categoryData = req.body;
    if (!categoryData.name || categoryData.name.trim().length === 0) {
        res.status(403).send({ message: 'Category field is required!' });
    } else {
        const toPascalCase = categoryData.name.replace(/\w\S*/g, name => name.charAt(0).toUpperCase() + name.substr(1).toLowerCase());
        const fielsToSave = {
            name: toPascalCase,
            userId: req.body.userId
        }
        try {
            const category = new Category(fielsToSave);
            await category.save();
            res.send(category);
        } catch (err) {
            res.status(400).send({ message: "This category is already exist!" });
        }
    }
}

const updateCategory = async (req, res) => {
    const updateCategoryData = req.body;
    if (!updateCategoryData.name || updateCategoryData.name.trim().length === 0) {
        res.status(403).send({ message: 'Category field is required!' });
    } else {
        const fielsToSave = {
            name: updateCategoryData.name
        }
        try {
            const category = await Category.findByIdAndUpdate(req.params._id, { $set: fielsToSave });
            if (!category) {
                return res.status(404).send({ error: 'Category not found' });
            }
            res.send(category);
        } catch (err) {
            res.status(400).send({ error: err.message });
        }
    }
}

const deleteCategory = async (req, res) => {
    try {
        const categoryCount = await Task.countDocuments({ categoryId: req.params._id })
        if (categoryCount > 0) {
            return res.status(400).json({ message: 'Category can not be delete as it is associated with one or more task.' });
        } else {
            const category = await Category.findByIdAndDelete(req.params._id);
            if (!category) {
                return res.status(404).send({ message: 'Category not found' });
            }
            res.send({ message: 'Category deleted' });
        }
    }
    catch (err) {
        res.status(400).send({ error: err.message });
    }
}

module.exports = { getCategory, getSelectCategory, createCategory, updateCategory, deleteCategory }
const Products = require('../models/productModel');

class APIFeatures {
    constructor(query, queryString) {
        this.query = query,
            this.queryString = queryString
    }
    filtering() {
        // queryString ===> req.query
        const queryObj = { ...this.queryString }
        // before delete page
        // console.log({ before: queryObj });

        const excludedFields = ["page", "sort", "limit"];
        excludedFields.forEach(el => delete (queryObj[el]));
        // after delete page
        // console.log({ after: queryObj });

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => "$" + match)

        // console.log({ queryObj, queryStr });

        this.query.find(JSON.parse(queryStr))

        return this

    }
    sorting() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(",").join(" ");
            this.query = this.query.sort(sortBy)
        } else {
            this.query = this.query.sort("-createdAt")
        }
        return this
    }
    paginating() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 9;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}

const getProducts = async (req, res) => {
    try {
        const features = new APIFeatures(Products.find(), req.query).filtering().sorting().paginating()
        const products = await features.query
        // const products = await Products.find();

        res.json({
            status: "success",
            products,
            result: products.length
        });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

const createProduct = async (req, res) => {
    try {
        const { product_id, title, price, description, content, images, category } = req.body;
        if (!title || !price || !description || !content || !category) return res.status(400).json({ msg: "title, price, descrption, content, category must all be provided" })
        if (!images) return res.status(400).json({ msg: "No image upload" });

        const product = await Products.findOne({ product_id });
        if (product) return res.status(400).json({ msg: "This product already exists" });

        const newProduct = new Products({
            product_id, title: title.toLowerCase(), price, description, content, images, category,
        });

        await newProduct.save()
        res.json({ msg: "created a product" });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        await Products.findByIdAndDelete(req.params.id);
        res.status(200).json({ msg: "Deleted a product" })
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { title, price, description, content, images, category } = req.body;
        if (!images) return res.status(400).json({ msg: "No image upload" });

        await Products.findOneAndUpdate({ _id: req.params.id }, {
            title: title.toLowerCase(), price, description, content, images, category
        });

        res.status(200).json({ msg: "Updated a product" });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

module.exports = {
    getProducts,
    createProduct,
    deleteProduct,
    updateProduct
}
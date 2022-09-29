const router = require('express').Router();

const {
    getCategories,
    createCategory,
    deleteCategory,
    updateCategory
} = require('../controllers/cartegoryCtrl');
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');

router.route("/category")
    .get(getCategories)
    .post(auth, authAdmin, createCategory);

router.route("/category/:id")
    .delete(auth, authAdmin, deleteCategory)
    .put(auth, authAdmin, updateCategory)
module.exports = router;
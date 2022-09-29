const jwt = require('jsonwebtoken');
const User = require('../models/userModels');

const authAdmin = async (req, res, next) => {
    try {
        //Get user by informaton by id
        const user = await User.findById(req.user.id);
        // console.log(user);
        if (user.role === 0) return res.status(401).json({ msg: "Admin resources access denied" });
        // Passing on to the next middleware
        next()

    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
};

module.exports = authAdmin;
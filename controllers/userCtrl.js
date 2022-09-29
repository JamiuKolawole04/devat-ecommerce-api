const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModels');
const Payment = require("../models/paymentModel")

const createAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
}

const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

}

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!email || !name) return res.status(400).json({ msg: "mail and name are required to proceed" });

        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "The email already exists" });

        if (password.length < 6) {
            return res.status(400).json({ msg: "Password should atleast be 6 characters long." });
        }

        // Password Encryption
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = new User({ ...req.body, password: passwordHash });

        // save the user
        await newUser.save();

        // then create a json web token for authentication
        const accessToken = createAccessToken({ id: newUser._id });
        const refreshToken = createRefreshToken({ id: newUser._id });

        req.session.name = refreshToken

        res.status(201).json({ msg: "Register Success!", accessToken, refreshtoken: refreshToken });


    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: err.message });
    }

}

const refreshToken = (req, res) => {
    try {
        // refrencing the cookie
        const rf_token = req.session.name;
        // checking if cookie exists
        if (!rf_token) return res.status(400).json({ msg: "Please Login or Register for cookies" });

        jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) {
                console.log(err)
                return res.status(400).json({ msg: "Please Login or Register" });

            }

            const accessToken = createAccessToken({ id: user.id });
            res.status(200).json({ accessToken });
        });


    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: err.message })
    }

}

const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) return res.status(400).json({ msg: "Provide email and password" });
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "User does not exist" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Incorrect password" });

        // if login success, create access and refresh token
        const accessToken = createAccessToken({ id: user._id });
        const refreshToken = createRefreshToken({ id: user._id });

        // setting cookie
        req.session.name = refreshToken


        return res.status(200).json({ accessToken, refreshtoken: refreshToken });
    } catch (err) {
        res.status(500).json({ msg: err.message })
    }

}

const logout = (req, res) => {
    try {
        res.clearCookie('refreshtoken', { path: '/user/refresh_token' });
        res.status(200).json({ msg: "Logged out" });
    } catch (err) {
        res.status(500).json({ msg: err.message });

    }

}

const getUser = async (req, res) => {
    try {
        // removing the passowrd with the "-" sign
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(400).json({ msg: "User does not exist" });

        res.json(user);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }


}

const addCart = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(400).json({ msg: "User does not exist" });

        await User.findByIdAndUpdate({ _id: req.user.id }, {
            cart: req.body.cart
        },
            {
                new: true,
                runValidators: true
            }
        );

        return res.status(200).json({ msg: "Added to cart" })
    } catch (err) {
        res.status(500).json({ msg: err.message })
    }
}

const gethistory = async (req, res) => {
    try {
        const history = await Payment.find({ user_id: req.user.id });
        res.json({ history })

    } catch (err) {
        res.status(500).json({ msg: err.message })
    }
}

module.exports = {
    register,
    login,
    logout,
    refreshToken,
    getUser,
    addCart,
    gethistory
}
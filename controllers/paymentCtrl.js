const Payments = require("../models/paymentModel");
const User = require("../models/userModels");
const Product = require("../models/productModel");


const getPayments = async (req, res) => {
    try {
        const payments = await Payments.find();
        res.status(200).json({ payments })

    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}

const createPayment = async (req, res) => {
    const user = await User.findById(req.user.id).select("name email");
    if (!user) return res.status(400).json({ msg: "User does not exist" });

    const { cart, paymentID, address } = req.body;
    const { _id, name, email } = user;

    const newPayment = new Payments({
        user_id: _id, name, email, cart, paymentID, address
    });

    cart.filter(item => {
        return sold(item._id, item.quantity, item.sold)
    })

    // console.log(newPayment);
    await newPayment.save()
    res.status(201).json({ newPayment });
}

const sold = async (id, quantity, oldsold) => {
    await Product.findOneAndUpdate({ _id: id }, {
        sold: quantity + oldsold
    },
        {
            new: true,
            runValidators: true
        }
    );
}

module.exports = {
    getPayments,
    createPayment
};
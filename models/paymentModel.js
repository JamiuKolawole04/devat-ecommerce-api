const { Schema, model } = require("mongoose");

const paymentSchema = Schema({
    user_id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    address: {
        type: Object,
        required: true,
    },
    paymentID: {
        type: String,
        required: true,
    },
    cart: {
        type: Array,
        default: [],
    },
    status: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true })

module.exports = model("Payments", paymentSchema)
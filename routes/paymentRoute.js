const router = require("express").Router();
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin")
const {
    getPayments,
    createPayment
} = require("../controllers/paymentCtrl");

router.route("/payment")
    .get(auth, authAdmin, getPayments)
    .post(auth, createPayment)


module.exports = router;    
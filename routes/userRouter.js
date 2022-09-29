const cors = require("cors");
const router = require('express').Router();
const auth = require('../middleware/auth');

const {
    register,
    login,
    logout,
    refreshToken,
    getUser,
    addCart,
    gethistory
} = require('../controllers/userCtrl')

router.post("/register", register);
router.post("/login", login);
router.get("/refresh_token", cors({ origin: "https://deployed-test-ecommerce-app.netlify.app" }), refreshToken);
router.get("/logout", logout);
router.get("/info", auth, getUser);
router.patch("/addcart", auth, addCart);
router.get("/history", auth, gethistory);

module.exports = router;
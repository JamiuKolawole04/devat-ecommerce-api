const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const token = req.header('Authorization');
        if (!token) return res.status(401).json({ msg: "Invalid authentication" });

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return res.status(401).json({ msg: "Invalid authentication" });

            req.user = user;
            // passing on to the next middleware.
            next()
        });
    } catch (err) {
        res.status(200).json({ msg: err.message });
    }
}

module.exports = auth;
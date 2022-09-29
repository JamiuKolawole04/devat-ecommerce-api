require('dotenv').config();

const express = require('express');
const app = express();
const connectDB = require('./db/connect');
const PORT = process.env.PORT || 4000;
const cookieParser = require('cookie-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const session = require("express-session");


const notFoundMiddleware = require('./middleware/not-found');

const userRoutes = require('./routes/userRouter');
const categoryRoutes = require('./routes/categoryRouter');
const uploadImgRoute = require('./routes/upload');
const productRoutes = require('./routes/productRouter');
const paymentRoutes = require("./routes/paymentRoute");

// midlewares in express
app.set("trust proxy", 1);

app.use(express.json());
app.use(cors({
    origin: "https://deployed-test-ecommerce-app.netlify.app",
    credentials: true
}))
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles: true
}));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: "session",
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 4,
        sameSite: "none",
        secure: true
    }
}));


// ROUTES
app.get("/", (req, res) => {
    res.status(200).json({ msg: "Server on !" })
});

app.use("/user", userRoutes);
app.use("/api/v1/", categoryRoutes);
app.use("/api/v1", uploadImgRoute);
app.use("/api/v1", productRoutes);
app.use("/api/v1", paymentRoutes);
app.use(notFoundMiddleware);

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL)
        app.listen(PORT, () =>
            console.log(`Server  listening on port ${PORT}...`)
        );
    } catch (error) {
        console.log(error);
    }
};

start();



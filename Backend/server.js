require("dotenv").config();
const express = require("express");
const cors = require("cors");
const userRouter = require("./Routes/userRouter")
const mongoose = require("mongoose");
const app = express();
const port = 5000;
const cookieParser = require("cookie-parser");


app.use(cors({credentials: true, origin: true}));


app.use(cookieParser());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

mongoose.connection.on('connected', () => {
 console.log('Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
 console.error('Mongoose connection error ', err);
});

// Middleware to connect to MongoDB
app.use(async (req, res, next) => {
 try {
    await mongoose.connect(process.env.MongoDb_url, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("DB is connected");
    next();
 } catch (error) {
    console.log("DB not connected", error.message);
    res.status(500).send("DB not connected"); // Send a response if DB connection fails
 }
});



app.use('/', userRouter); // Assuming userRouter is for user-related routes

app.listen(port, () => {
 console.log(`Server is running on port ${port}`);
});


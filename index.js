const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();

const route = require("./src/routes/route");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const DBConnection = async () => {

    const Data = process.env.MONGO_URI;
    try {
        await mongoose.connect(Data,{dbName: "sploot", useNewUrlParser: true});
        console.log("Database connected successfully");
    } catch (error) {
        console.log("Error while connecting with the database ", error);
    }
}
DBConnection()


app.get("/",(req, res) => {
    res.send("Welcome to backend api testing");
});

app.use("/api", route);

app.all('*', function (req, res) {
    return res
        .status(400)
        .send("Welcome to spLooT----");
});


app.listen(process.env.PORT || 5000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 5000))
});
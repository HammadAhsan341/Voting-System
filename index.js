const express = require("express");
const app = express();
const mongoose = require("mongoose");
mongoose.set('strictQuery', true);
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/AdminRoute");


mongoose.connect("mongodb://localhost:27017/VotingSystem_DB")
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

//middlewares
app.use(express.json());
app.use('/user',userRoute);
app.use('/admin',adminRoute);



app.listen(3000, function(){
    console.log("Server is Ready");
});
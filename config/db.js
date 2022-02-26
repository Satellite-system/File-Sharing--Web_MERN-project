require('dotenv').config();
const mongoose = require('mongoose');

const url = process.env.MONGO_URL;

const connectionPara  = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

function connectDB(){
    mongoose.connect(url, connectionPara)
    .then(() =>{ 
        console.log('Connected Successfully');
    }).catch((err) => {
        console.error('Not Connected '+err)
    });
}


module.exports = connectDB;
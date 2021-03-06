const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');

const PORT = process.env.PORT || 3000;
app.use(express.static('public')); //to tell location of css files
app.use(express.json()); //make sure it take json file formate from body of req

const connectDb = require('./config/db');
connectDb();

// CORS
const corsOptions = {
    origin: process.env.ALLOWED_CLIENTS.split(',')
    // ['http://localhost:3000', 'http://localhost:5000']
}

app.use(cors(corsOptions));
// Configure ejs- Template Engine
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

app.get('/',(req,res)=>{
    res.render('homePage');
})

//Routes
app.use('/api/files',require('./routes/file'));
app.use('/files',require('./routes/showFile'));

app.listen(PORT, ()=>{
    console.log(`Listening to PORT : ${PORT}`);
})
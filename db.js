const mongoose = require('mongoose');
require('dotenv').config();
const URI = process.env.URI

const connectToMongo=()=>{
    mongoose.connect(URI, ()=>{
        console.log("Connected to mongo successfully!")
    })
}

module.exports = connectToMongo;
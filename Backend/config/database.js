const mongoose = require('mongoose');

require('dotenv').config();

exports.connect = ()=>{
    mongoose.connect(process.env.MONGODB_URL,)
    .then(()=>{
        console.log("MongoDb Connected Successfully.")
    })
    .catch((err)=>{
        console.log("Error in MongoDb Connection.");
        console.error(err);
        process.exit(1);
    })}
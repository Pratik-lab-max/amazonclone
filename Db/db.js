const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/Amazonclone',{useNewUrlParser:true ,   useUnifiedTopology : true } )

const db=  mongoose.connection;


db.on("error" , console.error.bind(console , "connection error:"));
db.once("open" ,  function(){
    console.log("Database Connected Successfully with Mongo DB")
}) 
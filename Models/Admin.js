const mongoose  =  require('mongoose')

const adminModel  =  mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    mobile : {
        type :String,
        required : true,
        unique : true
    },
    email : {
        type:String,
        required:true,
        unique: true
    },
    password : {
        type : String,
        required :true
    }
})

const Admin  =  mongoose.model("Admin" , adminModel)

module.exports =  Admin
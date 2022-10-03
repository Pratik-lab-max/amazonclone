const mongoose = require('mongoose')
const validator = require("validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const secretKey = process.env.KEY;

const userSchema = new mongoose.Schema({

    yname:{
        type : String, 
        require : true, 
        trim : true                       //remove space from left and right
    },
    // mobile:{
    //     type : String, 
    //     require : true,
    //     unique : true,
    //     maxlength : 10
    // },
    email:{
        type : String, 
        require : true, 
        // unique : true, 
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is not valid")
            }
        }
    },
    password:{
        type : String, 
        require : true,
        minlength : 8
    },
    cpassword:{
        type : String, 
        require : true,
        minlength : 8
    },
    tokens : [
        {
            token : {
                type : String,
                require : true
            }
        }
    ],
    carts : Array
});


userSchema.pre("save", async function(next){
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12)
        this.cpassword = await bcrypt.hash(this.cpassword, 12)
    }

    next()
})

// generate tokens

userSchema.methods.generateAuthtoken = async function (){

    try {
        let token = jwt.sign({_id:this._id}, secretKey)
        this.tokens = this.tokens.concat({token:token})            //2nd token is from line 66
        await this.save()
        return token;
    } catch (error) {
        console.log(error)
    }
}

// add to cart data
userSchema.methods.addcartdata = async function(cart){
    try {
        this.carts = this.carts.concat(cart)
        await this.save()
        return this.carts
    } catch (error) {
        console.log(error)
    }
}

const USER = new mongoose.model("user",userSchema)

module.exports = USER;

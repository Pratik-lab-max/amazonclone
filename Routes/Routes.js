const express  =  require('express');

const router = express.Router()
const USER = require("../Models/userSchema")
const bcrypt = require("bcrypt")
const authenticate = require("../middleware/auth")
const myController  =  require('../Controllers/Controller')
const Products = require("../Models/Products");
const { json } = require('body-parser');


router.get('/add-product' ,  myController.addProduct )

//get products api
router.get("/getproducts", async(req,res)=>{
    try {
        const productsdata = await Products.find();
        // console.log("console the data" + productsdata)
        res.status(201).json(productsdata)
    } catch (error) {
        console.log("error" + error.message)
    }
})


//get individual data
router.get("/getproductsone/:id", async(req,res)=>{
    try { 
        const {id} = req.params
        // console.log(id)

        const individualdata = await Products.findOne({id:id})
        // console.log(individualdata + "individual data")

        res.status(201).json(individualdata)
    } catch (error) {
        res.status(400).json(individualdata)
        console.log("error" + error.message)
    }
})


// register data
router.post("/register" , async(req,res) => {
    // console.log(req.body)

    const {yname,email,password,cpassword} = req.body

    if (!yname || !email || !password || !cpassword) {
        res.status(422).json({error:"fill all the details"})
        console.log("not data available")
    }

    try {
        const saveduser = await USER.findOne({email:email})

        if (saveduser) {
            return res.status(422).json({error:"user already exists"})
        }else if(password !== cpassword) {
            return res.status(422).json({error:"password and cpassword not match"})
        }else{
            const user = new USER({
                yname,
                email,
                password,
                cpassword
            })
            const storedata = await user.save()
            console.log(storedata)
            res.status(201).json(storedata)
        }
    }catch (error) {
        
    }
})

// login user api
router.post("/login" , async(req,res) => {

    const {email,password} = req.body

    if(!email || !password){
        res.status(400).json({error:"fill all the details"})
        console.log("no data available")
    }

    try {
        const userlogin = await USER.findOne({email:email})
        // console.log(userlogin + "user value")

        if(userlogin) {
            const isMatch = await bcrypt.compare(password, userlogin.password)
            console.log(isMatch)

            //token generate
            const token = await userlogin.generateAuthtoken()
            // console.log(token)

            // generate cookie
            res.cookie("Amazonclone" ,token,{
                expires:new Date(Date.now() + 900000) ,
                httpOnly:true 
            })

            if(!isMatch){
                res.status(400).json({error:"Invalid password"})
            }else{
                res.status(201).json(userlogin)
            }
        }else{
            res.status(400).json({error:"Invalid details"})
        }
    } catch (error) {
        res.status(400).json({error:"invalid details"})    
    }
})


// *********NOTE******  //
// when the addcart api call, 1st the authentication function call, then get cookie value & then verify with secret key , then we get a id, /n
// then with the help of id we get a user then (if one can {req.User._id} on router page) then we send a user id then call next method, 
// then we send a user to router page , in this if we call {req.User._id} then it will find from auth.js page, if we find user{line no 136} 
// then we add data in add to cart ->we add it by a(function call with helps of a instance method), 
// then we send data then with the help of concat (method=> dfn in userschema) we store every data in cart 
// as the data is stored we send a response to frontend if there is a error we show it othrwise not

// adding the data into cart
router.post("/addcart/:id" ,authenticate,async(req,res) => {
    try {
        const {id} = req.params
        const cart = await Products.findOne({id:id})
        console.log(cart + "cart value")

        const UserContact = await USER.findOne({_id:req.userID})
        console.log(UserContact)

        if(UserContact){                                                       
            const cartData = await UserContact.addcartdata(cart)
            await UserContact.save()
            console.log(cartData)
            res.status(201).json(UserContact)
        }else{
            res.status(401).json({error:"invalid user"})
        }
    } catch (error) {
        res.status(401).json({error:"invalid user"})
    }
})


// get cart details
router.get("/cartdetails" , authenticate,async(req,res) => {

    try {
        const buyuser = await USER.findOne({_id:req.userID})
        res.status(201).json(buyuser)
    } catch (error) {
        console.log("error" + error)
    }
})

// get valid user
router.get("/validuser" , authenticate,async(req,res) => {

    try {
        const validuserone = await USER.findOne({_id:req.userID})
        res.status(201).json(validuserone)
    } catch (error) {
        console.log("error" + error)
    }
}) 


// remove item from cart
router.delete("/remove/:id", authenticate,async(req,res)=>{

    try {
        const {id} = req.params
        req.rootUser.carts = req.rootUser.carts.filter((curval)=>{
            return curval.id != id
        })

        req.rootUser.save()
        res.status(201).json(req.rootUser)
        console.log("item remove")
    } catch (error) {
        console.log("error" + error)
        res.status(400).json(req.rootUser)
    }
})


// logout user api
router.get("/logout" , authenticate,async(req,res) => {
    try {
        req.rootUser.tokens = req.rootUser.tokens.filter((curelem)=>{
            return curelem.token !== req.token
        })

        res.clearCookie("Amazonclone", {path:"/"})
        req.rootUser.save()
        res.status(201).json(req.rootUser.tokens)
        console.log("user logout")
    } catch (error) {
        console.log("error for user logout")
    }
})

 


module.exports  =  router;









// router.get('/show-products' ,myController.showProducts) 
// router.get('/admin-register-form' ,myController.adminRegForm) 
// router.post('/admin-reg' , myController.getAdminFormData) 
// router.post('/admin-upd' , myController.update Admin)
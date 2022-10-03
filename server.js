require("dotenv").config()
const express  =  require('express')
const bodyParser = require("body-parser")
const app =   express()
const PORT  = 2974
// const PORT  = process.env.PORT || 2974
const cors = require("cors")
const cookieParser = require("cookie-parser")

const myRoutes  =  require('./Routes/Routes')

const db   =  require('./Db/db')

const Product = require("./Models/Products")
const DefaultData = require("./Data")


app.use(cors())
app.use(express.json())
app.use(cookieParser(""))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : true}))

app.use('/'  ,myRoutes)

// if(process.env.NODE_ENV === "production"){
//     app.use(express.static("amazon/build"))
// }

app.listen(PORT , ()=>{
    console.log(`Server is running on PORT  :  ${PORT}`)
})

DefaultData()
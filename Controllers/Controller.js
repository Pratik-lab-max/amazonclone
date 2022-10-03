const Product = require("../Models/Products")
const productsdata = require('../Products/productsdata')

exports.addProduct = (req,res) =>{
    
    Product.insertMany(
        productsdata
    ).then((result)=>{
        res.status(200).send({msg : "Product Added Successfully !"})
    }).catch((err)=>{
        res.status(400).send({msg : "Something Went Wrong! "})
    })

}


// exports.showProducts =  (req,res)=>{
//     res.send("<h1>This is Show Products</h1>")
// } 

// exports.adminRegForm = (req,res) => {
//     res.status(200).send(
    
//     `<html>
//         <body>
//             <form method="POST" action="/admin-reg">
//                 <input placeholder= "Enter your name" name="name" /> <br></br>
//                 <input placeholder= "Enter your mobile" name="mobile" /> <br></br>
//                 <input placeholder= "Enter your email" name="email" /> <br></br>
//                 <input placeholder= "Enter your password" name="password" /> <br></br>
//                 <button type="submit">Submit</button>
//             </form>
//         </body>
//     </html>`
// )
// }

// exports.getAdminFormData = (req,res) => {
//     res.send(req.body) 

//     var Admin = new AdminModel(req.body)
    
//     Admin.save().then((result)=>{
//         res.send("Admin registered successfully with ID ${result._id}")
//     }).catch((err)=>{
//         res.send("Something Went Wrong! ")
//     })
// }
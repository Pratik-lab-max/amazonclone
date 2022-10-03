const Products = require("./Models/Products")
const productsdata = require("./Products/productsdata")

const DefaultData = async()=>{
    try {

        await Products.deleteMany({});
        
        const storeData = await Products.insertMany(productsdata)
        console.log(storeData);
    } catch (error) {
        console.log("error" +error.message)
    }
}

module.exports = DefaultData;
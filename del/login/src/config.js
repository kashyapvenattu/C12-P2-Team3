//this is database file.
const mongoose = require ('mongoose');
const connect = mongoose.connect("mongodb://localhost:27017/commute");

//check database connection:
connect.then(() =>
{
    console.log("Database connected Successfully");
})

.catch(()=>
{
    console.log("Database can not be connected");
})

//Create a Schema:
const LoginSchema = new mongoose.Schema
({
    name:
    {
        type: String,
        required: true
        
    },
    password:
    {
        type: String,
        required: true
        
    },
    dislikedRoutes: 
    [{
        type: String
    }],
    favoriteRoutes: 
    [{
        type: String
    }]
    
})

//create a model
const collection = new mongoose.model("mainUsers", LoginSchema);

//export module
module.exports = collection;
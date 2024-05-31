import mongoose from 'mongoose'

const userSchema = new mongoose.Schema
({
    username:
    {
        type: String,
        required: true,
        trim: true,
        minlength: 3, // minimum length constraint - this can be changed
        maxlength: 50 // maximum length constraint - this can be changed
    },  
    password:
    {
        type: String,
        required: true,
        trim: true
    },
    dislikedRoutes: {
        type: Array
    },
    favoriteRoutes: {
        type: Array
    }
})

//create a model
const userModel = mongoose.model("Users", userSchema);

export default userModel
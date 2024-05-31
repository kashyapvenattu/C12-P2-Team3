const mongoose = require("mongoose");

const LoginSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3, // minimum length constraint - this can be change
        maxlength: 50 // maximum length constraint - this can be change
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    dislikedRoutes: [{
        type: String
    }],
    favoriteRoutes: [{
        type: String
    }]
});

const mainusers= new mongoose.model("mainuser", LoginSchema);

module.exports=mainusers;
const express = require ('express');
const path = require ("path");
const collection = require ("./config.js");

const app = express();
//convert the data into the json format with the app.use method
app.use(express.json());

//url encoded method
app.use(express.urlencoded({extended: false}));


//view engine
app.set('view engine','ejs');

//static file // this is for the linking the static file
app.use(express.static("public"));

app.get("/login.ejs", (req, res) =>{
    res.render("login");
});

app.get("/signup.ejs", (req, res) =>{
    res.render("signup");
});

//Signup functionality
app.post("/signup.ejs", async (req, res) =>
{
    const data =
    {
        name: req.body.username,
        password: req.body.password,
    }
    //check user credential ecist and avoid overwritten.
    const existingUser = await collection.findOne({name: data.name});
    if (existingUser)
    {
        res.send("This user is already exist. Please try different username.");
        // return;// return the user
    }
    else
    {
        const userdata = await collection.insertMany(data);
        console.log(userdata);
    }

});
//  Login user
app.post("/login.ejs", async (req, res) => {
    try {
        const data = {
            name: req.body.username,
            password: req.body.password,
        };

        // Check if the user exists
        const existingUser = await collection.findOne({ name: data.name });
        if (!existingUser) {
            return res.status(404).send("User not found.");
        }

        // Check if the provided password matches the stored password
        if (existingUser.password !== data.password) {
            return res.status(401).send("Incorrect password.");
        }
        // Password matches, render to home page or send success response
        res.render("home.ejs"); // Render to home page
        

    } catch (error) {
        console.error("An unexpected error occurred:", error);
        res.status(500).send("An unexpected error occurred. Please try again later.");
    }
});



const port = 5000;
app.listen(port, () =>{
    console.log(`Server running on Port: ${port}`);
});
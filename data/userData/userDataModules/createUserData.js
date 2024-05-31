import mongoose from 'mongoose'
import userModel from './userModel.js'

//make function to check if username already exists
// if user exists, return true
// otherwise, return false
// Model.find() will return an empty array if the document does not exist
// thus, we will check if there are elements in the array to verify if the user exists
async function doesUserExist(username, db) {
    try {
        await mongoose.connect(db)
        const check = await userModel.find({username: username})
        if(check.length != 0) {
            console.log(check)
            console.log("user exists")
            return true
        } else {
            console.log(check)
            console.log("user does not exist")
            return false
        }
    } catch(error) {
        console.log("issue with registration")
    } finally {
        await mongoose.disconnect()
    }
}


async function newUser(username, password, db) { // all arguments are strings
    await mongoose.connect(db)
    try {
        await userModel.create({username: username, password: password})
    } catch(error) {
        console.log("Can't create user.")
    }
    finally {
        await mongoose.disconnect()
    }
}

//doesUserExist("buckoroni", "mongodb://localhost:27017/test")

export default {doesUserExist, newUser}
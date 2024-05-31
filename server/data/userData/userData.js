import mongoose from "mongoose"
import userModel from "./userDataModules/userModel.js"
import createUserData from "./userDataModules/createUserData.js"
import deleteUser from "./userDataModules/deleteUserData.js"
import updateUser from "./userDataModules/updateUserData.js"

const model = userModel
const alreadyExists = createUserData.doesUserExist
const create = createUserData.newUser
const remove = deleteUser
const update = updateUser

async function find(username, password, db) {
    try {
        await mongoose.connect(db)
        const check = await userModel.findOne({username: username})
        if(check.length != 0) {
            //console.log(check)
            //console.log("user exists")
            return check
        } else {
            console.log(check)
            return console.log("invalid login")
        }
    } catch(error) {
        console.log("invalid login")
    } finally {
        // await mongoose.disconnect()
    }
}


export default {model, alreadyExists, create, update, remove, find}
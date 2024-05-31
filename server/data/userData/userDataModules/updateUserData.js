import mongoose from 'mongoose'
import userModel from './userModel.js'

async function updateUser(username, update, db) { //id and db are strings, update is an object
    await mongoose.connect(db);
    try {
        await userModel.findOneAndUpdate({username: username}, update) //{id: id passed from function}
    } catch(error) {
        console.log("Can't update user")
    } finally {
        await mongoose.disconnect()
    }
}

export default updateUser
import mongoose from 'mongoose'
import userModel from './userModel.js'

async function deleteUser(username, db) { // id and db are strings
    await mongoose.connect(db)
    try {
        await userModel.findOneAndDelete({username: username})
    } catch(error) {
        console.log("Can't delete user.")
    }
    finally {
        await mongoose.disconnect()
    }
}

export default deleteUser
import mongoose from 'mongoose';

export default async function routes(/*db*/){
    // await mongoose.connect(db);

    var Schema = mongoose.Schema;
    var constructionSchema = new Schema({
        construction_info: {type: String, unique: true},
        description: String,
        start_dt: String,
        end_dt: String,
        longitude: String,
        latitude: String,
    })
    
    var Construction = mongoose.model('Construction', constructionSchema);
    Construction.init().then(() => {
        console.log('Constuction indexes are ready');})

    try{
        const response = await fetch('https://data.calgary.ca/resource/w8zq-79bq.json')
        const data = await response.json();

        await Construction.insertMany(data, {ordered:false});
        console.log("Data inserted successfully")
    } catch (err){
        if (err.name === 'MongoBulkWriteError' && err.code === 11000){
            console.warn("Duplicate key error encountered, but insertion continued")
        } else {
            console.error("Error:", err);            
        }
    } finally {
        // await mongoose.disconnect();
    }
}
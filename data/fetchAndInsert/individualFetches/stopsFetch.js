import mongoose from 'mongoose';

export default async function routes(/*db*/){
    // await mongoose.connect(db);

    var Schema = mongoose.Schema;
    var stopsSchema = new Schema({
        teleride_number: {type: String, unique: true},
        stop_name: String,
        status: String,
        create_dt_utc: String,
        mod_dt_utc: String,
        globalid: String
    });
    
    var Stops = mongoose.model('Stops', stopsSchema);
    Stops.init().then(() => {
        console.log('Stop indexes are ready');})

    try{
        const response = await fetch('https://data.calgary.ca/resource/muzh-c9qc.json')
        const data = await response.json();

        await Stops.insertMany(data, {ordered:false});
        console.log("Stops data inserted successfully")
    } catch (err){
        if ((err.name === 'MongoBulkWriteError' && err.code === 11000) || (err.name === 'DuplicateKey' && err.code === 11000)){
            console.warn("Duplicate key error encountered, but insertion continued")
        } else {
            console.error("Error:", err);            
        }
    } finally {
        // await mongoose.disconnect();
    }
}
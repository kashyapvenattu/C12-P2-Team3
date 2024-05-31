import mongoose from 'mongoose';

export default async function routes(/*db*/){
    // await mongoose.connect(db);

    var Schema = mongoose.Schema;
    var snowAndIceSchema = new Schema({
        route_category: String,
        route_short_name: {type: String, unique: true},
        route_long_name: String,
        create_dt_utc: String,
        mod_dt_utc: String,
        globalid: String,
        multilinestring: Array,
    });
    
    var SnowAndIce = mongoose.model('SnowAndIce', snowAndIceSchema);
    SnowAndIce.init().then(() => {
        console.log('Snow and Ice indexes are ready');})

    try{
        const response = await fetch('https://data.calgary.ca/resource/4v8s-3kss.json')
        const data = await response.json();

        await SnowAndIce.insertMany(data, {ordered:false});
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
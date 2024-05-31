import mongoose from 'mongoose';

export default async function routes(/*db*/){
    // await mongoose.connect(db);

    var Schema = mongoose.Schema;
    var trafficIncidentsSchema = new Schema({
        incident_info:	{type: String, unique: true},
        description: String,
        start_dt: String,
        modified_dt: String,
        quadrant: String, 
        count: String,
        longitude: Number,
        latitude: Number,
    })
    
    var TrafficIncidents = mongoose.model('TrafficIncidents', trafficIncidentsSchema);
    TrafficIncidents.init().then(() => {
        console.log('Traffic Indcidents indexes are ready');})
    
    await TrafficIncidents.deleteMany({})

    try{
        const response = await fetch('https://data.calgary.ca/resource/4jah-h97u.json')
        const data = await response.json();

        await TrafficIncidents.insertMany(data, {ordered:false});
        console.log("Traffic incidents data inserted successfully")
    } catch (err){
        if ((err.name === 'MongoBulkWriteError' && err.code === 11000) /*|| (err.name === 'DuplicateKey' && err.code === 11000)*/){
            console.warn("Duplicate key error encountered in traffic Incidents, but insertion continued")
        } else {
            console.error("Error:", err);            
        }
    } finally {
        // await mongoose.disconnect();
    }
}
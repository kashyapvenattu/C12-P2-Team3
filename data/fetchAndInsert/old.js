import mongoose from "mongoose";

async function main() {
  await mongoose.connect(
    "mongodb+srv://iridescentstormuser:k0GkmACeJvVh84Q0@cluster01.tw6gwdx.mongodb.net/?retryWrites=true&w=majority&appName=cluster01"
  );

  var Schema = mongoose.Schema;
  var routesSchema = new Schema({
    route_category: String,
    route_short_name: { type: String, unique: true },
    route_long_name: String,
    create_dt_utc: String,
    mod_dt_utc: String,
    globalid: String,
    multilinestring: Array,
  });

  var stopSchema = new Schema({
    teleride_number: { type: String, unique: true },
    stop_name: String,
    status: String,
    create_dt_utc: String,
    mod_dt_utc: String,
    globalid: String,
  });

  var constructionSchema = new Schema({
    construction_info: { type: String, unique: true },
    description: String,
    start_dt: String,
    end_dt: String,
    longitude: String,
    latitude: String,
  });

  var trafficIncidentsSchema = new Schema({
    incident_info: { type: String, unique: true },
    description: String,
    start_dt: String,
    modified_dt: String,
    quadrant: String,
    count: String,
    longitude: String,
    latitude: String,
  });

  var snowAndIceClearingSchema = new Schema({
    priority: String,
  });

  var Route = mongoose.model("Route", routesSchema);
  Route.init().then(() => {
    console.log("Route indexes are ready");
  });
  var Stops = mongoose.model("Stop", stopSchema);
  Stops.init().then(() => {
    console.log("Stop indexes are ready");
  });
  var ConstructionDetours = mongoose.model(
    "ConstructionDetours",
    constructionSchema
  );
  ConstructionDetours.init().then(() => {
    console.log("Construction detour indexes are ready");
  });
  var TrafficIncidents = mongoose.model(
    "TrafficIncidents",
    trafficIncidentsSchema
  );
  TrafficIncidents.init().then(() => {
    console.log("Traffic Construction indexes are ready");
  });
  var SnowAndIce = mongoose.model("SnowAndIce", snowAndIceClearingSchema);
  SnowAndIce.init().then(() => {
    console.log("Snow and Ice priority route indexes are ready");
  });

  //const promises = []
  try {
    const routeResponse = await fetch(
      "https://data.calgary.ca/resource/hpnd-riq4.json"
    );
    const routeData = await routeResponse.json();
    //promises.push(routeResponse.json());

    const stopsResponse = await fetch(
      "https://data.calgary.ca/resource/muzh-c9qc.json"
    );
    const stopsData = await stopsResponse.json();
    //promises.push(stopsResponse.json());

    //await Promise.all(promises)
    const constructionResponse = await fetch(
      "https://data.calgary.ca/resource/w8zq-79bq.json"
    );
    const constructionData = await constructionResponse.json();

    const trafficIncidentsResponse = await fetch(
      "https://data.calgary.ca/resource/4jah-h97u.json"
    );
    const trafficIncidentsData = await trafficIncidentsResponse.json();

    const snowAndIceResponse = await fetch(
      "https://data.calgary.ca/resource/4v8s-3kss.json"
    );
    const snowAndIceData = await snowAndIceResponse.json();

    await Route.insertMany(routeData, { ordered: false });
    await Stops.insertMany(stopsData, { ordered: false });
    await ConstructionDetours.insertMany(constructionData, { ordered: false });
    await TrafficIncidents.insertMany(trafficIncidentsData, { ordered: false });
    await SnowAndIce.insertMany(snowAndIceData, { ordered: false });

    console.log("Data inserted successfully");
  } catch (err) {
    if (err.name === "MongoBulkWriteError" && err.code === 11000) {
      console.warn("Duplicate key error encountered, but insertion continued.");
    } else {
      console.error("Error:", err);
    }
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((err) => console.log(err));

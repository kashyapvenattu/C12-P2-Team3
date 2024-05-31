import mongoose from "mongoose";

var Schema = mongoose.Schema;
var trafficIncidentsSchema = new Schema({
  incident_info: { type: String, unique: true },
  description: String,
  start_dt: String,
  modified_dt: String,
  quadrant: String,
  count: String,
  longitude: Number,
  latitude: Number,
});
const Incident = mongoose.model("TrafficIncidents", trafficIncidentsSchema);

await mongoose.connect(
  "mongodb+srv://iridescentstormuser:k0GkmACeJvVh84Q0@cluster01.tw6gwdx.mongodb.net/?retryWrites=true&w=majority&appName=cluster01"
);
async function incidentsQuery() {
  return await Incident.find({});
}
// mongoose.disconnect()
export default incidentsQuery;

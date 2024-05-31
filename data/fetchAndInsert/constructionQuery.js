import mongoose from "mongoose";

var Schema = mongoose.Schema;
var constructionSchema = new Schema({
  construction_info: { type: String, unique: true },
  description: String,
  start_dt: String,
  end_dt: String,
  longitude: String,
  latitude: String,
});

var Construction = mongoose.model("Construction", constructionSchema);

await mongoose.connect(
  "mongodb+srv://iridescentstormuser:k0GkmACeJvVh84Q0@cluster01.tw6gwdx.mongodb.net/?retryWrites=true&w=majority&appName=cluster01"
);
async function constructionQuery() {
  return await Construction.find();
}

// // Move the below out to the frontend or controller to pass back only what is needed
// const constructionDetours = await Construction.find({})
// let constuctionDetourArray = []
// if (constructionDetours.length > 0){
//     for (let i = 0; i < constructionDetours.length; i++){
//         constuctionDetourArray.push({ "lat" : constructionDetours[i].latitude, "log" : constructionDetours[i].longitude, "description": constructionDetours[i].description})
//     }
// }
// console.log(constuctionDetourArray)

// mongoose.disconnect()
export default constructionQuery;

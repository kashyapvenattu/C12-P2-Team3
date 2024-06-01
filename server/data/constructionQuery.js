import mongoose from "mongoose";

import dotenv from "dotenv";
dotenv.config();

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

await mongoose.connect(process.env.MONOG_DB_CONNECTION_STRING);

async function constructionQuery() {
  return await Construction.find();
}

// mongoose.disconnect()
export default constructionQuery;

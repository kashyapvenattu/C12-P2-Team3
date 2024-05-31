import mongoose from "mongoose";
import route from "./individualFetches/routeFetch.js";
import construction from "./individualFetches/constructionFetch.js";
import stops from "./individualFetches/stopsFetch.js";
import snowAndIce from "./individualFetches/snowAndIce.js";
import trafficIncidents from "./individualFetches/trafficIncidentsFetch.js";

const db =
  "mongodb+srv://iridescentstormuser:k0GkmACeJvVh84Q0@cluster01.tw6gwdx.mongodb.net/?retryWrites=true&w=majority&appName=cluster01";

async function main(db) {
  await mongoose.connect(db);

  try {
    await Promise.all([
      route(),
      construction(),
      stops(),
      //snowAndIce(),
      trafficIncidents(),
    ]);
    console.log("All data fetched and inserted successfully.");
  } catch (error) {
    console.error("An error occurred during the operations:", error);
  } finally {
    await mongoose.disconnect();
  }
}
//main(db);

export default main;
//imports the function to populate the each api into our database, can import any as needed

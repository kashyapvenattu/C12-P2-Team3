import express from "express";
import constructionQuery from "./data/constructionQuery.js";
import likeDislikeRank from "./algo/likeDislikeRank.js";
const app = express();
const prefrences = likeDislikeRank;

app.use(express.json({ limit: "50mb" })); //added file limit to increase file transfer size

app.use(express.json());

app.get("/", function (req, res) {
  res.send("Hello World!!!");
});

app.get("/api/construction", async function (req, res) {
  const detours = await constructionQuery();
  let constructionDetourArray = [];
  if (detours.length > 0) {
    for (let i = 0; i < detours.length; i++) {
      constructionDetourArray.push({
        position: { lat: +detours[i].latitude, lng: +detours[i].longitude },
        desc: detours[i].description,
      });
    }
  }
  res.send(constructionDetourArray);
});

app.post("/api/googleData", async function (req, res) {
  let routes = req.body;
  const match = prefrences.likeDislikeMatch(routes, [
    "neutral",
    "dislike",
    "like",
  ]);
  const ranked = prefrences.rank(match);
  res.send({ ranked });
});

app.get("/api/");

app.listen(4319);

console.log("Server started @ port 4319");

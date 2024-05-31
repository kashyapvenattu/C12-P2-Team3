import express from "express";
// import bodyParser from 'body-perser'
import main from "./data/fetchAndInsert/fetchAndInsert.js";
import userData from "./data/userData/userData.js";
import likeDislikeRank from "./algo/likeDislikeRank.js";
import constructionQuery from "./data/fetchAndInsert/constructionQuery.js";
import incidentsQuery from "./data/fetchAndInsert/incidentsQuery.js";

import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// constants
const user = userData;
const prefrences = likeDislikeRank;
const testDB = process.env.MONOG_DB_CONNECTION_STRING;
const userDB = process.env.MONOG_DB_CONNECTION_STRING;

app.use(express.json({ limit: "50mb" })); //added file limit to increase file transfer size
//app.use(express.urlencoded({limit: '50mb'}))

// get app to parse json
app.use(express.json());

//get current user logged in

app.get("/", function (req, res) {
  res.send("Hello World");
});

app.get("/api/fetch", function (req, res) {
  main(testDB);
  res.send("Data has been fetched and inserted into database");
});

app.get("/api/construction", async function (req, res) {
  const detours = await constructionQuery();
  let constructionDetourArray = [];
  if (detours.length > 0) {
    for (let i = 0; i < detours.length; i++) {
      // constructionDetourArray.push({ "lat" : detours[i].latitude, "lng" : detours[i].longitude, "desc": detours[i].description})
      // constructionDetourArray.push({ "lat" : +detours[i].latitude, "lng" : +detours[i].longitude})
      constructionDetourArray.push({
        position: { lat: +detours[i].latitude, lng: +detours[i].longitude },
        desc: detours[i].description,
      });
    }
  }
  res.send(constructionDetourArray);
});

app.get("/api/traffic", async function (req, res) {
  const detours = await incidentsQuery();
  let trafficDetourArray = [];
  if (detours.length > 0) {
    for (let i = 0; i < detours.length; i++) {
      // trafficDetourArray.push({ "lat" : detours[i].latitude, "log" : detours[i].longitude, "description": detours[i].description })
      trafficDetourArray.push({
        lat: detours[i].latitude,
        log: detours[i].longitude,
      });
    }
  }
  res.send(trafficDetourArray);
});

app.post("/api/signup", async function (req, res) {
  (await user.alreadyExists(req.body.userName, userDB))
    ? console.log("User already exists")
    : await user.create(req.body.userName, req.body.password, userDB);
  console.log(req.body);
  res.send("test");
});

app.post("/api/login", async function (req, res) {
  let exists = await user.find(req.body.userName, req.body.password, userDB);
  if (exists.password === req.body.password) {
    // res.json("Success")
    res.json(exists);
  } else {
    res.json("Login error");
  }
});

app.post("/api/like", function (req, res) {
  //need to be updated to a post
  user.update(
    "TheRealSlimShady",
    { $push: { favoriteRoutes: "Test" } },
    userDB
  );
  res.send("User liked routes has been updated");
});

app.post("/api/googleData", async function (req, res) {
  let routes = req.body;
  // console.log(routes.routes[1].legs[0].duration)
  const match = prefrences.likeDislikeMatch(routes, [
    "neutral",
    "dislike",
    "like",
  ]);
  // console.log(match)
  const ranked = prefrences.rank(match);
  // console.log(ranked)
  res.send({ ranked });
});

app.get("/api/getLike", function (req, res) {
  //need to add a read
  res.send("Return the liked routes here");
});

app.get("/api/deleteLike", function (req, res) {
  //need to add a delete
  res.send("User Liked Route Deleted");
});

app.get("/api/dislike", function (req, res) {
  //needs to be updated to a post
  user.update("Anix", { $push: { dislikedRoutes: "Test" } }, userDB);
  res.send("");
});

app.get("/api/getDislike", function (req, res) {
  //need to add a read
  res.send("Return the Disliked routes here");
});

app.get("/api/deleteDislike", function (req, res) {
  //need to add a delete
  res.send("User Disliked Route Deleted");
});

app.get("/api/prefrences", function (req, res) {
  //get user data in here.
  //prefrences.rank(likeDislikeRank())
});

app.get("/api/construction", async function (req, res) {
  const detours = await constructionQuery();
  let constructionDetourArray = [];
  if (detours.length > 0) {
    for (let i = 0; i < detours.length; i++) {
      // constructionDetourArray.push({ "lat" : detours[i].latitude, "log" : detours[i].longitude, "description": detours[i].description})
      constructionDetourArray.push({
        lat: +detours[i].latitude,
        lng: +detours[i].longitude,
      });
    }
  }
  res.send(constructionDetourArray);
});

app.get("/api/traffic", async function (req, res) {
  const detours = await incidentsQuery();
  let trafficDetourArray = [];
  if (detours.length > 0) {
    for (let i = 0; i < detours.length; i++) {
      trafficDetourArray.push({
        lat: detours[i].latitude,
        log: detours[i].longitude,
        description: detours[i].description,
      });
    }
  }
  res.send(trafficDetourArray);
});

app.get("/api/");

app.listen(4319); //random number choosen by asking a friend (cause 3000 or whatever is just a bit boring)

console.log("You're gonna carry that weight");
// console.log(process.env.MONOG_DB_CONNECTION_STRING, "Test");

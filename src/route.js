const express = require("express");

const faceComparing = require("./controllers/faceComparing");
const faceUpload = require("./controllers/faceUpload");
const faceSearch = require("./controllers/faceSearch");
const faceDelete = require("./controllers/faceDelete");

const route = express.Router();

route.get("/", (req, res) => res.json({ error: false, message: "OK." }));
route.post("/faceComparing", faceComparing.handler);
route.post("/faceUpload", faceUpload.handler);
route.post("/faceSearch", faceSearch.handler);
route.post("/faceDelete", faceDelete.handler);

module.exports = route;

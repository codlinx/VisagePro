const express = require("express");

const faceComparing = require("./controllers/faceComparing");

const route = express.Router();

route.get("/", (req, res) => res.json({ error: false, message: "OK." }));
route.post("/faceComparing", faceComparing.handler);

module.exports = route;

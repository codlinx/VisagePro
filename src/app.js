const express = require("express");
const cors = require("cors");
// const inspector = require("@inspector-apm/inspector-nodejs")({
//   ingestionKey: "cc696271e408bbdee99dc3b6958f804ee1478121",
// });

const route = require("./route");
const isAllowed = require("./middlewares/isAllowed");

const app = express();

// app.use(inspector.expressMiddleware());
app.use(cors());
app.use(express.json({ limit: "999mb" }));
app.use(isAllowed);
app.use("/api/v1", route);

module.exports = app;

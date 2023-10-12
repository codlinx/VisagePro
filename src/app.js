const express = require("express");

const route = require("./route");
const isAllowed = require("./middlewares/isAllowed");

const app = express();

app.use(express.json({ limit: "999mb" }));
app.use(isAllowed);
app.use("/api/v1", route);

module.exports = app;

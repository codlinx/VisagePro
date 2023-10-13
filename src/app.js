const express = require("express");
const cors = require("cors");

const route = require("./route");
const isAllowed = require("./middlewares/isAllowed");

const app = express();

app.use(cors());
app.use(express.json({ limit: "999mb" }));
app.use(isAllowed);
app.use("/api/v1", route);

module.exports = app;

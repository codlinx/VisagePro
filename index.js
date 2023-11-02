require("dotenv/config");
require("@tensorflow/tfjs-node");

const app = require("./src/app");

app.listen(process.env.PORT);

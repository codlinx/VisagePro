require("dotenv/config");

const app = require("./src/app");
const sync = require("./src/sync");

app.listen(process.env.PORT);

(async () => {
  await sync();
  console.log("Database synchronized");
})();

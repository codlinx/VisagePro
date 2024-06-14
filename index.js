require("dotenv/config");

const sync = require("./src/sync");

(async () => {
  await sync();
  console.log("Database synchronized");

  const app = require("./src/app");
  app.listen(process.env.PORT);
})();

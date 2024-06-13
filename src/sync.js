const Customer = require("./models/Customer");
const Face = require("./models/Face");

async function syncModels() {
  await Customer.sync();
  await Face.sync();

  return true;
}

module.exports = syncModels;

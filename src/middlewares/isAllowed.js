const allows = require("../allows");

module.exports = (req, res, next) => {
  const token = req.headers["authorization"] || req.headers["Authorization"];

  if (allows.includes(token)) return next();

  return res.status(401).json({ error: true, message: "Não autorizado." });
};

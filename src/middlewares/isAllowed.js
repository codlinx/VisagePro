const Customer = require("../models/Customer");

module.exports = async (req, res, next) => {
  const token = req.headers["authorization"] || req.headers["Authorization"];
  if (!token)
    return res.status(401).json({ error: true, message: "Não autorizado." });

  const customer = await Customer.findOne({ where: { uuid: token } });
  if (!customer)
    return res.status(401).json({ error: true, message: "Não autorizado." });
  if (!customer.status === "Ativo")
    return res.status(401).json({ error: true, message: "Não autorizado." });

  req.customer = customer;

  return next();
};

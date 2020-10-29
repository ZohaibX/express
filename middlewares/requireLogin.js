module.exports = (req, res, next) => {
  if (!req.userId) {
    return res.status(401).send({ error: "You must login first" });

    next();
  }
};

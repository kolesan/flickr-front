function isFinitePositive(v) {
  return typeof v == "number" && !Number.isNaN(v) && Number.isFinite(v);
}

module.exports = {
  isFinitePositive
};

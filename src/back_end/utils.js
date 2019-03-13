function noSpaces(s) {
  if (typeof s !== "string") {
    return;
  }
  return s.replace(/\s/g, "");
}

function minmax(min, max, val) {
  return Math.max(Math.min(val, max), min);
}

function toPositiveInt(n) {
  return Math.max(0, Number(n) || 0);
}

module.exports = {
  noSpaces,
  minmax,
  toPositiveInt
};
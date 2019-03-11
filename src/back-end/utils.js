function noSpaces(s) {
  if (typeof s !== "string") {
    return;
  }
  return s.replace(/\s/g, "");
}

module.exports = {
  noSpaces
};
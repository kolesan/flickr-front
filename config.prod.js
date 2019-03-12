const commonConfig = require('./config');

module.exports = Object.assign({}, commonConfig, {
  server: {
    host: "localhost",
    port: 3000
  },
  bundleDir: "dist"
});

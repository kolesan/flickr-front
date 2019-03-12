const commonConfig = require('./config');

module.exports = Object.assign({}, commonConfig, {
  server: {
    host: "localhost",
    port: 8080
  },
  bundleDir: "dist",
  production: true
});

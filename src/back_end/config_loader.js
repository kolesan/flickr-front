const environment = process.argv.slice(2)[0] || "prod";
console.log({args: process.argv.slice(2), environment});

const environmentConfig = require('../../config.' + environment);

console.log({environmentConfig, environment});

module.exports = {
  config: environmentConfig
};

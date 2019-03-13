const { isFinitePositive } = require('./MathUtils');
const { min, max } = Math;

function newReserve(capacity) {
  validate(capacity);

  let reserved = 0;

  return Object.freeze({
    get reserved() {
      return reserved;
    },
    add(n) {
      reserved = min(reserved + n, capacity);
    },
    remove(n) {
      reserved = max(reserved - n, 0);
    },
    reset() {
      reserved = 0;
    },
    isEmpty() {
      return reserved === 0;
    }
  });
}

function validate(capacity) {
  if (!isFinitePositive(capacity)) {
    throw Error(`Reserve capacity has to be positive finite number. Was: ${capacity}`);
  }
}

module.exports = {
  newReserve
};
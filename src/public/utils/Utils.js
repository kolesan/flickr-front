export function minmax(min, max) {
  return function(val) {
    return Math.max(Math.min(val, max), min);
  }
}

export function noop() {}
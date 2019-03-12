export function div(a, b) {
  return Math.floor(a / b);
}

export function minmax(min, max) {
  return function(val) {
    return Math.max(Math.min(val, max), min);
  }
}
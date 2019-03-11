export function minmax(min, max) {
  return function(val) {
    return Math.max(Math.min(val, max), min);
  }
}

export function pushToFront(arr, ...items) {
  arr.splice(0, 0, ...items);
}
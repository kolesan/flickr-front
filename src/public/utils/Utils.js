export function pushToFront(arr, ...items) {
  arr.splice(0, 0, ...items);
}
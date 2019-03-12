export default function inst() {
  let reserved = 0;
  return Object.freeze({
    get reserved() {
      return reserved;
    },
    add(n) {
      reserved += n;
    },
    remove(n) {
      reserved = Math.max(0, reserved - n);
    }
  });
}
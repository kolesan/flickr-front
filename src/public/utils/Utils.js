
export function noop() {}

export function throttle(ms, fn) {
  let state = {};
  return function () {
    if (!state.throttling) {
      fn();
      state.throttling = true;
      setTimeout(() => {
        state.throttling = false;
      }, ms);
    }
  }
}
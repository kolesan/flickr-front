export const ifAny = Symbol("Function to be performed on array elements if there is at least one");
export const ifNone = Symbol("Function to be performed if array is empty");

Array.prototype[ifAny] = function(fn) {
  if (this.length > 0) {
    fn(this);
  }
  return this;
};

Array.prototype[ifNone] = function(fn) {
  if (this.length === 0) {
    fn();
  }
  return this;
};
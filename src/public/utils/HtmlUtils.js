import { log } from "./Logging";

export function element({tag, classes, children = [], attributes = {}, listeners = {}, data = {}, value, text}) {
  let elem = document.createElement(tag);

  classes && classes.split(" ").forEach(c => elem.classList.add(c));
  children.forEach(it => elem.appendChild(it));
  Object.keys(attributes).forEach(k => elem.setAttribute(k, attributes[k]));
  Object.keys(listeners).forEach(k => elem.addEventListener(k, listeners[k]));
  Object.keys(data).forEach(k => elem.dataset[k] = data[k]);

  if (value !== undefined && value !== null) {
    elem.value = value;
  }

  if (typeof text == "string" && text.length > 0) {
    elem.appendChild(textNode(text));
  }

  return elem;
}

export function textNode(v) {
  return document.createTextNode(v);
}

export function removeChildNodes(parent, predicate = ()=>true) {
  let removedChildren = [];
  let children = Array.from(parent.children);

  children.forEach((child, i) => {
    if (predicate(child, i)) {
      let removedChild = parent.removeChild(child);
      removedChildren.push(removedChild);
    }
  });

  return removedChildren;
}

export function appendChildrenToHead(parent, children) {
  let firstChild = parent.firstChild;
  children.forEach(child =>
    parent.insertBefore(child, firstChild)
  );
  return children;
}

export function appendChildrenToTail(parent, children) {
  children.forEach(child => parent.appendChild(child));
  return children;
}
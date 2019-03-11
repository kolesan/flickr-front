import { log } from "./Logging";

export function element({tag, classes, children = [], attributes = {}, listeners = {}, data = {}, style = {}, value, text}) {
  let elem = document.createElement(tag);

  classes && classes.split(" ").forEach(c => elem.classList.add(c));
  children.forEach(it => elem.appendChild(it));
  Object.keys(attributes).forEach(k => elem.setAttribute(k, attributes[k]));
  Object.keys(listeners).forEach(k => elem.addEventListener(k, listeners[k]));
  Object.keys(data).forEach(k => elem.dataset[k] = data[k]);

  Object.assign(elem.style, style);

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

export function appendChildren(parent, ...children) {
  children.forEach(child => parent.appendChild(child));
  return children;
}
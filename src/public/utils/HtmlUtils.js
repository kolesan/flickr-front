import { log } from "./Logging";

export function element(options) {
  const { tag, ...otherOptions } = options;
  let element = document.createElement(tag);
  return decorateElement(element, otherOptions);
}

export function decorateElement(element, options) {
  const {
    classes, children = [],
    attributes = {}, listeners = {},
    data = {}, style = {},
    value, text
  } = options;

  classes && classes.split(" ").forEach(c => element.classList.add(c));
  children.forEach(it => element.appendChild(it));
  Object.keys(attributes).forEach(k => element.setAttribute(k, attributes[k]));
  Object.keys(listeners).forEach(k => element.addEventListener(k, listeners[k]));
  Object.keys(data).forEach(k => element.dataset[k] = data[k]);

  Object.assign(element.style, style);

  if (value !== undefined && value !== null) {
    element.value = value;
  }

  if (typeof text == "string" && text.length > 0) {
    element.appendChild(textNode(text));
  }

  return element;
}

export function textNode(v) {
  return document.createTextNode(v);
}

export function appendChildren(parent, ...children) {
  children.forEach(child => parent.appendChild(child));
  return children;
}
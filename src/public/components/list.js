import log from "../utils/Logging";
import toListItem from "./list_item";
import { appendChildren, element } from "../utils/HtmlUtils";

export default function inst(container) {
  let buffer = [];

  let list = listElement();
  container.appendChild(list);

  return Object.freeze({
    get items() {
      return Array.from(list.children);
    },
    get bufferLength() {
      return buffer.length;
    },
    buffer(pictures) {
      buffer.push(...pictures.map(toListItem));
    },
    clearBuffer() {
      buffer = [];
    },
    show(count) {
      let shown = buffer.splice(0, count);
      log("buffer", buffer.length, shown);
      appendChildren(list, ...shown);
      return shown;
    },

  });
}

function listElement() {
  return element({
    tag: "ul",
    classes: "list"
  })
}

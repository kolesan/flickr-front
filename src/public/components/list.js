import './list.css';

import log from "../utils/Logging";
import listPhotoItem from "./list_photo_item";
import listEndItem from "./list_end_item";
import { appendChildren, element } from "../utils/HtmlUtils";

export default function inst(container) {
  let buffer = [];

  let list = listElement();
  container.appendChild(list);

  let ended = false;

  return Object.freeze({
    get items() {
      return Array.from(list.children);
    },
    get bufferLength() {
      return buffer.length;
    },
    buffer(pictures) {
      buffer.push(...pictures.map(listPhotoItem));
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
    showEnd() {
      if (!ended) {
        appendChildren(list, listEndItem());
        ended = true;
      }
    }
  });
}

function listElement() {
  return element({
    tag: "ul",
    classes: "list"
  })
}
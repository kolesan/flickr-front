import './list_item.css';

import { element } from "../utils/HtmlUtils";

export default function listItem(...children) {
  return element({
    tag: "li",
    classes: "list__item",
    children
  })
}

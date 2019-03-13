import './list_end_item.css';

import { element } from "../utils/HtmlUtils";

export default function inst() {
  return element({
    tag: "li",
    classes: "list__end_item",
    text: "This is the end, my friend.",
    attributes: {
      title: "There are no more photos, refresh the page and try other tags from the control panel to the left."
    }
  });
}
